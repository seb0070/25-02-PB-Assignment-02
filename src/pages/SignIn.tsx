import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { isLoggedIn } from '../utils/authState';
import { isValidEmail } from '../utils/validators';
import { registerUser, loginUser } from '../utils/auth';

const SignIn = () => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const resetForm = () => {
        setEmail('');
        setPassword('');
        setConfirm('');
    };


    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/');
        }
    }, [navigate]);


    const handleSubmit = () => {
        if (mode === 'register') {
            if (!isValidEmail(email)) {
                alert('올바른 이메일 형식이 아닙니다.');
                return;
            }

            if (password !== confirm) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }

            const result = registerUser(email, password);
            alert(result.message);

            if (result.success) {
                resetForm();
                setMode('login');
            }
        }
    else {
            const result = loginUser(email, password);
            alert(result.message);

            if (result.success) {
                navigate('/');
            }
        }
    };

    return (
        <div>
            <h2>{mode === 'login' ? '로그인' : '회원가입'}</h2>

            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="비밀번호" />

            {mode === 'register' && (
                <input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" placeholder="비밀번호 확인" />
            )}

            <button onClick={handleSubmit}>
                {mode === 'login' ? '로그인' : '회원가입'}
            </button>

            <p
                onClick={() => {
                    resetForm();
                    setMode(mode === 'login' ? 'register' : 'login');
                }}
            >
                {mode === 'login' ? '회원가입 하러가기' : '로그인 하러가기'}
            </p>
        </div>
    );
};

export default SignIn;
