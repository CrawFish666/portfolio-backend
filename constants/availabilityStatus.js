// Единственное место, где перечислены допустимые статусы доступности
// И ЗНАЧЕНИЕ (value), И ТЕКСТ ДЛЯ ЮЗЕРА (label) — единственный источник
// правды. Фронт больше не хранит свою копию этого списка — он получает
// его в ответе GET /settings (см. settingsController.js).
const AVAILABILITY_STATUS_OPTIONS = [
	{ value: "open_to_offers", label: "Открыт для предложений" },
	{ value: "employed_open", label: "Работаю, открыт к интересным предложениям" },
	{ value: "employed_closed", label: "Работаю, предложения не рассматриваю" },
];

const AVAILABILITY_STATUS_VALUES = AVAILABILITY_STATUS_OPTIONS.map((o) => o.value);

// Оставляем и старый объект-мапу — им удобно пользоваться внутри бэкенда
// (например, default: AVAILABILITY_STATUSES.OPEN_TO_OFFERS в модели)
const AVAILABILITY_STATUSES = {
	OPEN_TO_OFFERS: "open_to_offers",
	EMPLOYED_OPEN: "employed_open",
	EMPLOYED_CLOSED: "employed_closed",
};

module.exports = { AVAILABILITY_STATUSES, AVAILABILITY_STATUS_VALUES, AVAILABILITY_STATUS_OPTIONS };