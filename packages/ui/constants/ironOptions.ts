import { IronSessionOptions } from 'iron-session';

// TODO Reveiw settings. Extract this to config file
// https://github.com/vvo/iron-session#ironoptions
const ironOptions: IronSessionOptions = {
    cookieName: 'DFGC_siwe',
    password: "complex_password_at_least_32_characters_long",
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
};

export default ironOptions;