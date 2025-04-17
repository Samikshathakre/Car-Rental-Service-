import { useState, useEffect, useRef } from 'react';

export default function LoginPage() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [showOtpField, setShowOtpField] = useState(false);
    const [timer, setTimer] = useState(30);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];

    // Handle timer for OTP resend
    useEffect(() => {
        let interval;
        if (isTimerRunning && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsTimerRunning(false);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timer]);

    const handleSendOtp = (e) => {
        e.preventDefault();
        if (!phoneNumber || phoneNumber.length < 10) {
            alert('Please enter a valid phone number');
            return;
        }
        setShowOtpField(true);
        setTimer(30);
        setIsTimerRunning(true);
        // Reset OTP if resending
        setOtp(['', '', '', '']);
        // Simulate sending OTP
        alert(`OTP sent to ${phoneNumber}`);
    };

    const handleOtpChange = (index, value) => {
        // Only allow numbers
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        // Take only the last character if multiple are pasted
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto-focus next input if current field is filled
        if (value && index < 3) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Handle backspace to move to previous input
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').trim();

        // Check if pasted content is numeric
        if (/^\d+$/.test(pastedData)) {
            const digits = pastedData.split('').slice(0, 4);
            const newOtp = [...otp];

            digits.forEach((digit, index) => {
                if (index < 4) {
                    newOtp[index] = digit;
                }
            });

            setOtp(newOtp);

            // Focus on the appropriate field after paste
            if (digits.length < 4) {
                inputRefs[digits.length].current.focus();
            }
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 4) {
            alert('Please enter the complete 4-digit OTP');
            return;
        }
        alert(`Login attempted with OTP: ${otpString}`);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Left side - Creative Car Image Background with elements */}
            <div className="hidden md:block md:w-1/2 relative">
                {/* Base background with overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-900/40 to-black/30 z-20" />
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('/Images/car.avif')`,
                        filter: 'saturate(1.2) brightness(0.9)'
                    }}
                />

                {/* Creative overlay elements */}
                <div className="absolute inset-0 z-30">
                    {/* Top curved shape */}
                    <div className="absolute top-0 left-0 right-0 h-24 bg-emerald-600/20 backdrop-blur-sm"
                        style={{
                            borderBottomRightRadius: '100%',
                            borderBottomLeftRadius: '100%',
                        }}
                    />

                    {/* Bottom accent shape */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-emerald-700/30 backdrop-blur-sm"
                        style={{
                            borderTopLeftRadius: '50%',
                            borderTopRightRadius: '50%',
                        }}
                    />

                    {/* Decorative circles */}
                    <div className="absolute top-1/3 left-1/3 w-16 h-16 rounded-full bg-emerald-500/20 backdrop-blur-md" />
                    <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-emerald-500/10 backdrop-blur-sm" />
                    <div className="absolute bottom-1/4 left-1/2 w-32 h-32 rounded-full bg-emerald-500/15 backdrop-blur-sm" />

                    {/* Branding elements */}
                    <div className="absolute top-8 left-8 text-white">
                        <div className="font-bold text-xl tracking-wider">CARZY</div>
                        <div className="h-1 w-12 bg-emerald-400 mt-1"></div>
                    </div>

                    {/* Tagline */}
                    <div className="absolute bottom-16 left-0 right-0 text-center text-white">
                        <h2 className="text-2xl font-light tracking-wide">Rent. Ride. Repeat!</h2>
                        <div className="h-1 w-24 bg-emerald-400 mx-auto mt-2"></div>
                    </div>
                </div>
            </div>

            {/* Right side - Login Form with Zepto-inspired OTP UI */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
                <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
                    {!showOtpField ? (
                        <>
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-800">Login</h2>
                                <p className="text-gray-500 mt-2">Enter your phone number to continue</p>
                            </div>

                            <form onSubmit={handleSendOtp} className="space-y-6">
                                <div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="phone"
                                            type="tel"
                                            placeholder="Phone number"
                                            className="pl-12 w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 shadow-sm text-lg"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-emerald-500 text-white py-4 px-4 rounded-xl hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 transition-colors duration-300 shadow-md font-medium text-lg"
                                >
                                    Continue
                                </button>
                            </form>

                            <p className="mt-6 text-sm text-gray-500 text-center">
                                By continuing, you agree to our <span className="text-emerald-600">Terms of Service</span> and <span className="text-emerald-600">Privacy Policy</span>
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Verify Your Number</h2>
                                <p className="text-gray-500 mt-2">We've sent a 4-digit code to</p>
                                <p className="text-gray-800 font-medium mt-1">{phoneNumber}</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-8">
                                {/* Zepto-style pill-shaped OTP inputs */}
                                <div className="flex justify-center gap-3">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={inputRefs[index]}
                                            type="text"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            onPaste={index === 0 ? handlePaste : null}
                                            className="w-12 h-14 text-center text-xl font-bold border-0 rounded-full bg-gray-100 focus:outline-none focus:bg-emerald-50 focus:ring-2 focus:ring-emerald-500 shadow-sm transition-all"
                                            required
                                        />
                                    ))}
                                </div>

                                {/* Timer and Resend */}
                                <div className="text-center mt-4">
                                    {isTimerRunning ? (
                                        <p className="text-gray-500">
                                            Resend code in <span className="font-medium">{timer}s</span>
                                        </p>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            className="text-emerald-600 font-medium hover:text-emerald-800"
                                        >
                                            Resend Code
                                        </button>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-emerald-500 text-white py-4 px-4 rounded-xl hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 transition-colors duration-300 shadow-md font-medium text-lg"
                                >
                                    Verify & Proceed
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => setShowOtpField(false)}
                                    className="text-emerald-600 hover:text-emerald-800 font-medium"
                                >
                                    Edit Phone Number
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}