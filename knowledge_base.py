"""Модуль базы знаний: читает knowledge_base.md и ищет ответ на вопрос пользователя."""

import os
import re

# Путь к файлу базы: он лежит в той же папке, что и этот модуль
KB_FILE = os.path.join(os.path.dirname(__file__), "knowledge_base.md")

# Слова, которые встречаются почти в любом вопросе и не помогают найти ответ
STOP_WORDS = {
    "как", "что", "где", "мне", "меня", "можно", "это", "для", "или", "если",
    "мой", "моя", "мои", "моё", "есть", "нужно", "надо", "почему", "когда",
    "какие", "какой", "какая", "все", "так", "уже", "еще", "ещё", "чтобы",
    "был", "была", "было", "быть", "его", "она", "они", "вас", "вам", "нас",
}

# Насколько вопрос должен совпасть с записью базы, чтобы бот ответил (от 0 до 1)
MIN_SCORE = 0.5


def load_knowledge_base(path=KB_FILE):
    """Читает файл базы знаний и возвращает список записей.

    Каждая запись — словарь: вопрос, варианты вопроса, категория, ответ.
    """
    entries = []
    current = None  # запись, которую сейчас читаем

    with open(path, encoding="utf-8") as file:
        for line in file:
            line = line.strip()

            if line.startswith("### "):
                # Начало новой записи. Сохраняем предыдущую и начинаем новую.
                if current is not None:
                    entries.append(current)
                question = re.sub(r"^\d+\.\s*", "", line[4:])  # убираем номер «1. »
                current = {"question": question, "variants": [], "category": "", "answer": ""}

            elif current is None or line.startswith("#") or line == "---":
                continue  # шапка файла, заголовки разделов и разделители пропускаем

            elif line.startswith("Варианты вопроса:"):
                text = line[len("Варианты вопроса:"):]
                variants = re.findall(r"«([^»]+)»", text)  # всё, что в кавычках-ёлочках
                if not variants:
                    variants = text.split(",")  # если кавычек нет — делим по запятым
                current["variants"] = [v.strip() for v in variants if v.strip()]

            elif line.startswith("Категория:"):
                current["category"] = line[len("Категория:"):].strip()

            elif line.startswith("Ответ:"):
                current["answer"] = line[len("Ответ:"):].strip()

            elif line and current["answer"]:
                current["answer"] += "\n" + line  # продолжение ответа на следующей строке

    if current is not None:
        entries.append(current)
    return entries


def keywords(text):
    """Превращает текст в набор «основ» слов для сравнения.

    Берём первые 4 буквы слова, чтобы «баллы», «баллов» и «баллам» считались одним словом.
    """
    text = text.lower().replace("ё", "е")
    words = re.findall(r"[а-яa-z0-9]+", text)
    return {word[:4] for word in words if len(word) > 2 and word not in STOP_WORDS}


def find_answer(message, entries):
    """Ищет в базе запись, которая лучше всего подходит к сообщению.

    Возвращает пару (запись, оценка). Если ничего не подошло — (None, лучшая оценка).
    """
    message_words = keywords(message)
    if not message_words:
        return None, 0.0

    best_entry = None
    best_score = 0.0

    for entry in entries:
        for text in [entry["question"]] + entry["variants"]:
            text_words = keywords(text)
            if not text_words:
                continue
            common = message_words & text_words  # общие слова
            # Оценка от 0 до 1: учитывает, какая часть слов совпала и в вопросе из базы,
            # и в сообщении. Так короткий вопрос из базы не «побеждает» только за счёт того,
            # что в нём мало слов.
            score = 2 * len(common) / (len(text_words) + len(message_words))
            if score > best_score:
                best_score = score
                best_entry = entry

    if best_score >= MIN_SCORE:
        return best_entry, best_score
    return None, best_score
