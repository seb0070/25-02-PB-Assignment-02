import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';
import { isLoggedIn } from '../utils/authState';
import { loginUser, registerUser } from '../utils/auth';
import './SignIn.css';

type Mode = 'login' | 'register';

const SignIn = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<Mode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (isLoggedIn()) navigate('/');
    }, [navigate]);

    const handleSubmit = () => {
        if (mode === 'register') {
            const result = registerUser(email, password);
            alert(result.message);
            if (result.success) setMode('login');
        } else {
            const result = loginUser(email, password);
            alert(result.message);
            if (result.success) navigate('/');
        }
    };

    return (
        <div className="signin">
            <div className="signin__content">
                <header className="brand brand--enter">
                    <h1 className="brand__title">NETFLIX DEMO</h1>
                </header>

                <section className={`card card--enter ${mode}`}>
                    <div className="segmented">
                        <button
                            className={`segmented__btn ${mode === 'login' ? 'is-active' : ''}`}
                            onClick={() => setMode('login')}
                        >
                            로그인
                        </button>
                        <button
                            className={`segmented__btn ${mode === 'register' ? 'is-active' : ''}`}
                            onClick={() => setMode('register')}
                        >
                            회원가입
                        </button>
                        <div className={`segmented__pill ${mode === 'register' ? 'to-right' : ''}`} />
                    </div>

                    <div className="form-wrapper">
                        <div className={`form-panel ${mode}`}>
                            <h2 className="card__title">
                                {mode === 'login'
                                    ? '다시 오신 걸 환영해요'
                                    : '계정을 만들어볼까요'}
                            </h2>

                            <p className="card__subtitle">
                                {mode === 'login'
                                    ? '계정이 있다면 바로 감상할 수 있어요.'
                                    : '몇 단계만 거치면 바로 시작할 수 있어요.'}
                            </p>

                            <div className="card__form">
                                <div className="field">
                                    <FiMail />
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="field">
                                    <FiLock />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="비밀번호"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="iconBtn"
                                        onClick={() => setShowPassword((p) => !p)}
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>

                                {mode === 'register' && (
                                    <div className="field">
                                        <FiLock />
                                        <input
                                            type="password"
                                            placeholder="비밀번호 확인"
                                            value={confirm}
                                            onChange={(e) => setConfirm(e.target.value)}
                                        />
                                    </div>
                                )}

                                <button className="cta" onClick={handleSubmit}>
                                    {mode === 'login' ? '로그인' : '회원가입'}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SignIn;
