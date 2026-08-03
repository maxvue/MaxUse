export * from './documents';
export * from './isEmail';
export * from './cepIsValid';
export * from './isValid';
export * from './phone';
export * from './creditCard';

import * as documents from './documents';
import * as email from './isEmail';
import * as cep from './cepIsValid';
import * as phone from './phone';
import * as isValid from './isValid';
import * as creditCard from './creditCard';

export const validate = {
    ...documents,
    ...email,
    ...cep,
    ...phone,
    ...isValid,
    ...creditCard
};


