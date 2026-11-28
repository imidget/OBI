"""Логика агента: классифицирует обращение и решает, что сделать (F3, F4)."""

import uuid

from knowledge_base import load_knowledge_base, find_answer
from classifier import (
    classify, is_about_platform,
    KNOWLEDGE, REQUEST, COMPLAINT, SOLVE_TASK, OFF_TOPIC,
)

MAX_LENGTH = 1000  # максимальная длина сообщения в символах

# Базу знаний читаем один раз при запуске сервера, а не на каждое сообщение
KB = load_knowledge_base()

# Действия агента (пойдут в журнал)
ANSWERED = "ответил"
HANDED_OFF = "передал человеку"
REFUSED = "отказал"

# Кому передаём обращение
SUPPORT = "служба поддержки"
TEACHER = "учитель"

NOT_FOUND = (
    "Я пока не знаю ответа на этот вопрос. Я помогаю с вопросами о баллах, дедлайнах, "
    "контрольных, курсах и подписке. Если вопрос о другом, напишите учителю "
    "через «Чат с преподавателем» в меню."
)
SOLVE_REFUSAL = (
    "Я не решаю задания и не даю готовые ответы: так вы не научитесь, а на контрольной "
    "это нарушение правил. Могу подсказать, где найти материал: теория и разборы есть "
    "в разделе «Теория», а потренироваться можно в разделе «Практика». "
    "Если что-то непонятно, задайте вопрос учителю в «Чате с преподавателем»."
)
INJECTION_REFUSAL = (
    "Я не могу менять свои правила или показывать служебные инструкции. "
    "Я бот-помощник платформы «Вектор успеха» и помогаю с вопросами о баллах, "
    "дедлайнах, контрольных, курсах и подписке."
)
DANGER_REPLY = (
    "Мне очень жаль, что так происходит. Пожалуйста, расскажите об этом взрослому, "
    "которому вы доверяете: родителям, классному руководителю или школьному психологу. "
    "Если вам тяжело или страшно прямо сейчас, позвоните на детский телефон доверия "
    "8-800-2000-122 (бесплатно, круглосуточно). Я также передаю ваше обращение "
    "в службу поддержки платформы, номер обращения: {case_id}."
)
TECH_DEFAULT = (
    "Попробуйте обновить страницу, проверить интернет и зайти через другой браузер. "
    "Если не помогло, служба поддержки разберётся."
)


def handoff_text(to_whom, case_id):
    """Честное сообщение о передаче: кому и с каким номером, без обещаний результата."""
    if to_whom == TEACHER:
        return (f"Этот вопрос может решить только учитель. Я передал обращение учителю, "
                f"номер обращения: {case_id}. Вы также можете написать ему в «Чате с преподавателем».")
    return (f"Я передал ваше обращение в службу поддержки, номер обращения: {case_id}. "
            f"Сотрудник посмотрит его и ответит. Пообещать результат я не могу.")


def result(reply, category, action, case_id, handoff_to=None):
    """Собирает ответ агента в один словарь: его потом запишем в журнал."""
    return {
        "reply": reply,
        "category": category,
        "action": action,
        "handoff_to": handoff_to,
        "case_id": case_id,
    }


def handle_message(message):
    """Получает текст сообщения и возвращает словарь с ответом и решением агента."""
    case_id = uuid.uuid4().hex[:8]  # короткий номер обращения, например «3f9a1c2b»
    text = message.strip()

    # 1. Проверки из ТЗ: пустое и слишком длинное сообщение
    if text == "":
        return result("Напишите, пожалуйста, ваш вопрос.", OFF_TOPIC, ANSWERED, case_id)
    if len(text) > MAX_LENGTH:
        return result(f"Сообщение слишком длинное. Сократите его до {MAX_LENGTH} символов.",
                      OFF_TOPIC, ANSWERED, case_id)

    # 2. Классификация
    info = classify(text)
    category = info["category"]
    special = info["special"]

    # 3. Решение
    if special == "injection":
        return result(INJECTION_REFUSAL, category, REFUSED, case_id)

    if special == "danger":
        return result(DANGER_REPLY.format(case_id=case_id), category, HANDED_OFF, case_id, SUPPORT)

    if category == SOLVE_TASK:
        return result(SOLVE_REFUSAL, category, REFUSED, case_id)

    if special == "money":
        return result(handoff_text(SUPPORT, case_id), category, HANDED_OFF, case_id, SUPPORT)

    if special == "exception":
        return result(handoff_text(TEACHER, case_id), category, HANDED_OFF, case_id, TEACHER)

    entry, score = find_answer(text, KB)

    if category == COMPLAINT:
        # Жалоба: если в базе есть подсказка для этого случая, показываем её, и всегда передаём человеку
        hint = entry["answer"] + "\n\n" if entry and "человек" in entry["category"].lower() else ""
        return result(hint + handoff_text(SUPPORT, case_id), category, HANDED_OFF, case_id, SUPPORT)

    if category == REQUEST:
        # Техническая проблема: даём подсказку из базы (если есть) и передаём в поддержку
        hint = entry["answer"] if entry else TECH_DEFAULT
        return result(hint + "\n\n" + handoff_text(SUPPORT, case_id),
                      category, HANDED_OFF, case_id, SUPPORT)

    # Обычный вопрос
    if entry is not None:
        # Если в базе у записи сказано «передать человеку», передаём (например, «баллы не начислились»)
        if "человек" in entry["category"].lower():
            return result(entry["answer"] + "\n\nНомер обращения: " + case_id,
                          category, HANDED_OFF, case_id, SUPPORT)
        return result(entry["answer"], KNOWLEDGE, ANSWERED, case_id)

    if is_about_platform(text):
        # Вопрос про платформу, но в базе ответа нет — агент не уверен и не выдумывает
        return result("Я не нашёл точного ответа в своей базе и не хочу вас запутать.\n\n"
                      + handoff_text(SUPPORT, case_id),
                      KNOWLEDGE, HANDED_OFF, case_id, SUPPORT)

    return result(NOT_FOUND, OFF_TOPIC, ANSWERED, case_id)
