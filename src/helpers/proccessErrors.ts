export const processErrors = (errorData: any): string => {
	if (Array.isArray(errorData)) {
		// Обработка массива ошибок
		return errorData
			.map((error: { loc: string[]; msg: string; type: string }) => {
				const field = error.loc[1]; // Извлекаем имя поля из массива loc
				return `${field}: ${error.msg}`;
			})
			.join(', ');
	} else if (typeof errorData === 'string') {
		// Обработка строки ошибки
		return errorData;
	} else if (errorData && errorData.detail) {
		// Обработка объекта с полем detail
		return errorData.detail;
	}
	return 'An unknown error occurred';
};
