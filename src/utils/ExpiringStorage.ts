/**
 * @class ExpiringStorage
 * @classdesc - для работы с данными из localStorage
 */
export class ExpiringStorage {
	/**
	 * удалить из localStorage запись по ключу
	 * @param {string} key - название ключа
	 */
	public static remove(key: string): void {
		localStorage.removeItem(key);
	}

	/**
	 * получить данные из localStorage по ключу, если просрочен или отсутствует вернёт null
	 * @param {string} key - название ключа
	 * @returns {null|any}
	 */
	public static get<T>(key: string): T | null {
		const cached = JSON.parse(localStorage.getItem(key) || 'null');

		if (!cached) {
			return null;
		}

		const { dontUpdate, updateEveryDay } = cached;
		const expires = new Date(cached.expires);
		const currentDate = new Date();

		const clearStorage =
			!dontUpdate && expires < currentDate && (!updateEveryDay || expires.getDate() !== currentDate.getDate());

		if (clearStorage) {
			localStorage.removeItem(key);
			return null;
		}

		return cached.value;
	}

	/**
	 * обновить значение в localStorage
	 * @param {string} key - название ключа
	 * @param {*} value - сохраняемое значение
	 * @param {string|number} [lifeTimeInMinutes=0] - срок хранения записи в localStorage (в минутах или в течение дня)
	 * @returns {*|null} - вернёт обновленное значени из localStorage
	 */
	public static set<T>(key: string, value: T, lifeTimeInMinutes: string | number = 0): T | null {
		const currentTime = new Date().getTime();
		const dontUpdate = !lifeTimeInMinutes;
		const updateEveryDay = String(lifeTimeInMinutes) === 'day';
		const time = typeof lifeTimeInMinutes === 'string' ? 0 : (lifeTimeInMinutes as number) * 60000;
		const expires = new Date(currentTime + time);

		localStorage.setItem(key, JSON.stringify({ value, expires, dontUpdate, updateEveryDay }));
		return ExpiringStorage.get(key);
	}
}
