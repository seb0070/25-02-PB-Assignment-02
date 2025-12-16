import { useState } from 'react';

const SignIn = () => {
    const [mode, setMode] = useState<'login' | 'register'>('login');

    return (
        <div>
            <h2>{mode === 'login' ? '로그인' : '회원가입'}</h2>

            <input placeholder="이메일" />
            <input placeholder="비밀번호" type="password" />

            {mode === 'register' && (
                <input placeholder="비밀번호 확인" type="password" />
            )}

            <button>
                {mode === 'login' ? '로그인' : '회원가입'}
            </button>

            <p onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
                {mode === 'login'
                    ? '회원가입 하러가기'
                    : '로그인 하러가기'}
            </p>
        </div>
    );
};

export default SignIn;
