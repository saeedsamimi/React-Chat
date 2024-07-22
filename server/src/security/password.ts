import crypto from 'crypto';

function mixStrings(str1: string, str2: string): string {
	let result = '';
	let i: number;
	for (i = 0; i < str1.length; i++)
		result += str1[i] + str2[i];
	for (; i < str2.length; i++)
		result += str2[i++];
	for (; i < str1.length; i++)
		result += str2[i++];
	return result;
}

function generateSalt(length: number = 15): string {
	return crypto.randomBytes(length).toString('hex');
}

function hashPassword(password: string, salt: string) {
	const hash = crypto.createHash('SHA3-256');
	hash.update(mixStrings(password, salt));
	return hash.digest('hex');
}

export function hash(password: string): string {
	const salt = generateSalt();
	return salt.concat('$', hashPassword(password, salt));
}

export function verify(inputPassword: string, storedHashWithSalt: string): boolean {
	const [storedSalt, storedHash] = storedHashWithSalt.split('$');
	const inputHash = hashPassword(inputPassword, storedSalt);
	return inputHash === storedHash;
}
