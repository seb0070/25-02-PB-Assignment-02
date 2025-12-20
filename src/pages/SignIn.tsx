import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';
import { isLoggedIn } from '../utils/authState';
import { isValidEmail } from '../utils/validators';
import { loginUser, registerUser } from '../utils/auth';
import './SignIn.css';

type Mode = 'login' | 'register';

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const SignIn = () => {
    const [mode, setMode] = useState<Mode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shake, setShake] = useState(false);

    const navigate = useNavigate();
    const cardRef = useRef<HTMLDivElement | null>(null);

    const subtitle = useMemo(() => {
        return mode === 'login'
            ? '계정이 있다면 바로 감상할 수 있어요.'
            : '딱 10초, 계정 만들고 넷플릭스 감성으로 시작해요.';
    }, [mode]);

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setConfirm('');
        setShowPassword(false);
        setShowConfirm(false);
    };

    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/');
        }
    }, [navigate]);

    // ✅ 카드 3D 틸트 (마우스 움직임에 따라 아주 살짝)
    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;

        const handleMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const rotateY = clamp((x - 0.5) * 10, -8, 8);
            const rotateX = clamp((0.5 - y) * 10, -8, 8);

            el.style.setProperty('--rx', `${rotateX}deg`);
            el.style.setProperty('--ry', `${rotateY}deg`);
            el.style.setProperty('--mx', `${x * 100}%`);
            el.style.setProperty('--my', `${y * 100}%`);
        };

        const handleLeave = () => {
            el.style.setProperty('--rx', `0deg`);
            el.style.setProperty('--ry', `0deg`);
            el.style.setProperty('--mx', `50%`);
            el.style.setProperty('--my', `50%`);
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseleave', handleLeave);
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseleave', handleLeave);
        };
    }, []);

    const triggerShake = () => {
        setShake(true);
        window.setTimeout(() => setShake(false), 520);
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;

        // ✅ 1) 프론트 검증 (UI 애니메이션/피드백 포함)
        if (!isValidEmail(email)) {
            triggerShake();
            alert('올바른 이메일 형식이 아닙니다.');
            return;
        }
        if (password.length < 4) {
            triggerShake();
            alert('비밀번호는 4자 이상으로 입력해주세요.');
            return;
        }
        if (mode === 'register' && password !== confirm) {
            triggerShake();
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        // ✅ 2) '넷플릭스스러운' 로딩 연출
        setIsSubmitting(true);
        await new Promise((r) => window.setTimeout(r, 650));

        if (mode === 'register') {
            const result = registerUser(email, password);
            alert(result.message);

            if (result.success) {
                resetForm();
                setMode('login');
            }
        } else {
            const result = loginUser(email, password);
            alert(result.message);

            if (result.success) {
                navigate('/');
            }
        }

        setIsSubmitting(false);
    };

    return (
        <div className="signin">
            {/* 🎬 배경 레이어 (블러/그레인/스윕) */}
            <div className="signin__bg" aria-hidden />
            <div className="signin__vignette" aria-hidden />
            <div className="signin__grain" aria-hidden />

            <main className="signin__content">
                <div className="brand">
                    <div className="brand__mark" aria-hidden>
                        <div className="brand__n" />
                        <div className="brand__glow" />
                    </div>
                    <div className="brand__text">
                        <div className="brand__title">NETFLIX DEMO</div>
                        <div className="brand__tag">Cinematic • Fancy • Animated</div>
                    </div>
                </div>

                <section
                    ref={cardRef}
                    className={`card ${shake ? 'card--shake' : ''}`}
                    aria-label={mode === 'login' ? '로그인' : '회원가입'}
                >
                    <div className="card__shine" aria-hidden />
                    <div className="card__border" aria-hidden />

                    <header className="card__header">
                        <div className="segmented" role="tablist" aria-label="로그인/회원가입">
                            <button
                                type="button"
                                className={`segmented__btn ${mode === 'login' ? 'is-active' : ''}`}
                                onClick={() => {
                                    resetForm();
                                    setMode('login');
                                }}
                                role="tab"
                                aria-selected={mode === 'login'}
                            >
                                로그인
                            </button>
                            <button
                                type="button"
                                className={`segmented__btn ${mode === 'register' ? 'is-active' : ''}`}
                                onClick={() => {
                                    resetForm();
                                    setMode('register');
                                }}
                                role="tab"
                                aria-selected={mode === 'register'}
                            >
                                회원가입
                            </button>
                            <div className={`segmented__pill ${mode === 'register' ? 'to-right' : 'to-left'}`} aria-hidden />
                        </div>
                        <h2 className="card__title">{mode === 'login' ? '다시 오신 걸 환영해요' : '첫 장면을 시작해볼까요?'}</h2>
                        <p className="card__subtitle">{subtitle}</p>
                    </header>

                    <div className="card__form">
                        <Field
                            icon={<FiMail />}
                            label="이메일"
                            value={email}
                            onChange={setEmail}
                            placeholder="name@example.com"
                            autoComplete="email"
                        />

                        <Field
                            icon={<FiLock />}
                            label="비밀번호"
                            value={password}
                            onChange={setPassword}
                            placeholder="••••"
                            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                            type={showPassword ? 'text' : 'password'}
                            right={
                                <button
                                    type="button"
                                    className="iconBtn"
                                    onClick={() => setShowPassword((p) => !p)}
                                    aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            }
                        />

                        {mode === 'register' && (
                            <Field
                                icon={<FiLock />}
                                label="비밀번호 확인"
                                value={confirm}
                                onChange={setConfirm}
                                placeholder="••••"
                                autoComplete="new-password"
                                type={showConfirm ? 'text' : 'password'}
                                right={
                                    <button
                                        type="button"
                                        className="iconBtn"
                                        onClick={() => setShowConfirm((p) => !p)}
                                        aria-label={showConfirm ? '비밀번호 확인 숨기기' : '비밀번호 확인 표시'}
                                    >
                                        {showConfirm ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                }
                            />
                        )}

                        <button
                            type="button"
                            className={`cta ${isSubmitting ? 'is-loading' : ''}`}
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            <span className="cta__bg" aria-hidden />
                            <span className="cta__label">{mode === 'login' ? '로그인' : '회원가입'}</span>
                            <span className="cta__spark" aria-hidden />
                            {isSubmitting && <span className="cta__spinner" aria-hidden />}
                        </button>

                        <div className="meta">
                            <p className="meta__hint">
                                {mode === 'login' ? (
                                    <>
                                        아직 계정이 없나요?{' '}
                                        <button
                                            type="button"
                                            className="linkBtn"
                                            onClick={() => {
                                                resetForm();
                                                setMode('register');
                                            }}
                                        >
                                            회원가입
                                        </button>
                                        으로 시작해요.
                                    </>
                                ) : (
                                    <>
                                        이미 계정이 있나요?{' '}
                                        <button
                                            type="button"
                                            className="linkBtn"
                                            onClick={() => {
                                                resetForm();
                                                setMode('login');
                                            }}
                                        >
                                            로그인
                                        </button>
                                        으로 돌아가기.
                                    </>
                                )}
                            </p>
                            <p className="meta__fine">※ 과제용 데모 로그인입니다. 입력한 정보는 로컬 스토리지에만 저장돼요.</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

type FieldProps = {
    icon: ReactNode;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    autoComplete?: string;
    type?: 'text' | 'password';
    right?: ReactNode;
};

const Field = ({
                   icon,
                   label,
                   value,
                   onChange,
                   placeholder,
                   autoComplete,
                   type = 'text',
                   right,
               }: FieldProps) => {
    const id = useMemo(() => `${label}-${Math.random().toString(16).slice(2)}`, [label]);

    return (
        <div className="field">
            <div className="field__icon" aria-hidden>
                {icon}
            </div>
            <div className="field__control">
                <label className={`field__label ${value ? 'is-floating' : ''}`} htmlFor={id}>
                    {label}
                </label>
                <input
                    id={id}
                    className="field__input"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    inputMode={label.includes('이메일') ? 'email' : 'text'}
                    type={type}
                />
                <div className="field__underline" aria-hidden />
            </div>
            {right && <div className="field__right">{right}</div>}
        </div>
    );
};

export default SignIn;
