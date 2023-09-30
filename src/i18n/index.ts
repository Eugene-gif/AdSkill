import {Locales} from "./locales";

import ru from './ru.json';
import en from './en.json';

export const messages = {
    [Locales.EN]: en,
    [Locales.RU]: ru,
};

export const defaultLocale = Locales.EN;