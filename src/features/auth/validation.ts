import * as Yup from 'yup';

const email = Yup.string().email('Invalid email address').min(8, 'Must be 8 characters at minimum').max(254, 'Must be 254 characters or less').lowercase().trim().required()

const name = Yup.string().min(3, 'Must be 3 characters at minimum').max(128, 'Must be 128 characters or less').trim().required()

const password = Yup.string()
    .min(6, 'Must be 6 characters at minimum')
    .max(20, 'Must be 20 characters or less')
    .required('Required')

//for change Password
const oldPassword = Yup.string()
    .required('Required')
    .notOneOf([Yup.ref("password"), null], "Passwords must be different")

const confirmPassword = Yup.string()
    .required('Required')
    .oneOf([Yup.ref("password"), null], "Passwords must match")

export const registerSchema = Yup.object({
    name,
    email,
    password,
    confirmPassword
});
export const loginSchema = Yup.object({
    email,
    password,
});
export const forgotSchema = Yup.object({
    email,
});
export const resetSchema = Yup.object({
    password,
    confirmPassword
});
export const changePasswordSchema = Yup.object({
    oldPassword,
    password,
    confirmPassword
});
export const profileUpdateSchema = Yup.object({

});

// .matches(
//     "^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$",
//     "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
// )

// username: Yup.string()
//     .min(2, 'Must be 2 characters at minimum')
//     .max(20, 'Must be 20 characters or less')
//     .matches(/^[a-zA-Z0-9_]+$/, 'Invalid characters in username')
//     .required('Required'),
