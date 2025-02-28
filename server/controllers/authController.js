import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Buyer from '../models/buyerModel.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplate.js';


export const register = async (req, res) => {
    const { name, email, password, address, phone, isSeller } = req.body;

    if (!name || !email || !password || !address || !phone) {
        return res.json({ success: false, message: 'Missing details' })
    }

    if (name === 'Admin') return res.json({ success: false, message: 'Admin is a reserved name' });

    try {
        const existingUser = await Buyer.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new Buyer({ name, email, password: hashedPassword, phone, address, isSeller });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        //sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to App',
            text: `Welcome to My Website. Your account has been successfully created with emai ID ${email}`
        }

        await transporter.sendMail(mailOptions);

        return res.json({ success: true });

    } catch (error) {
        console.log('errr');
        res.json({ success: false, message: error.message })
    }
}



export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ success: false, message: 'Email and password requried' })
    }

    try {
        const user = await Buyer.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'Invalid Email' });
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.json({ success: false, message: 'Incorrect Password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true });

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        })

        return res.json({ success: true, message: 'Logged Out' })
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


export const sendVerifyOtp = async (req, res) => {
    try {

        const { userId } = req.body;
        const user = await Buyer.findById(userId);
        if (user.isAccountVerfied) {
            return res.json({ success: false, message: "Account already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account verification OTP',
            // text: `Your verification OTP is ${otp}. This OTP is valid for 24 hours from now.`
            html: EMAIL_VERIFY_TEMPLATE.replace("{{email}}", user.email).replace("{{otp}}", otp)
        }
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Verification OTP send on Email' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
        return res.json({ success: false, message: "Credentials missing" });
    }

    try {
        const user = await Buyer.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "Invalid user ID" });
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            // console.log(user.name);
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP has expired" });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        await user.save();

        return res.json({ success: true, message: "Email verified successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: "Email is required" });
    }

    try {

        const user = await Buyer.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpire = Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            //text: `Your OTP is ${otp}. This OTP is valid for 15 minutes from now.`
            html: PASSWORD_RESET_TEMPLATE.replace("{{email}}", user.email).replace("{{otp}}", otp)
        }
        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'OTP send on Email' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const resetPassword = async (req, res) => {
    const { email, otp, newPass } = req.body;

    if (!email || !otp || !newPass) {
        return res.json({ success: false, message: "All fields are required" });
    }

    try {

        const user = await Buyer.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.resetOtpExpire < Date.now()) {
            return res.json({ success: false, message: "OTP has expired" });
        }

        const hashedPass = await bcrypt.hash(newPass, 10);
        user.password = hashedPass;
        user.resetOtp = '';
        user.resetOtpExpire = 0;

        await user.save();

        return res.json({ success: true, message: "Password has been reset successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}