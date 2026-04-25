import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import lgmaritia from './assets/logomaritia.png';
import emailjs from '@emailjs/browser';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { auth, db } from './firebaseconf';
import { doc, setDoc } from "firebase/firestore";

emailjs.init("AnUfG7XrVnjZHLCp9");

function App() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [modo, setModo] = useState('login'); 
  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  // ESTADOS DA RECUPERAÇÃO
  const [modalRecuperar, setModalRecuperar] = useState(false);
  const [etapa, setEtapa] = useState(1); 
  const [emailRecuperacao, setEmailRecuperacao] = useState('');
  const [codigoDigitado, setCodigoDigitado] = useState('');
  const [inputCodigo, setInputCodigo] = useState('');

  const acaoPrincipal = () => {
    setMensagemErro('');
    if (modo === 'login') {
      signInWithEmailAndPassword(auth, email, senha)
        .then(() => navigate('/ficha'))
        .catch((err) => {
          setMensagemErro(err.code === 'auth/invalid-credential' ? "E-mail ou senha incorretos." : "Erro ao acessar o portal.");
        });
    } else {
      createUserWithEmailAndPassword(auth, email, senha)
        .then(() => {
          setMensagemSucesso("✨ Conta criada! Redirecionando...");
          setTimeout(() => {
            setModo('login');
            setMensagemSucesso('');
          }, 1500);
        })
        .catch((err) => {
          setMensagemErro(err.code === 'auth/email-already-in-use' ? "Este e-mail já está em uso." : "Erro ao criar conta.");
        });
    }
  };

  const enviarCodigoEmail = () => {
    if (!emailRecuperacao) {
      alert("Por favor, digite um e-mail válido!");
      return;
    }

    const novoCodigo = Math.floor(100000 + Math.random() * 900000).toString();
    setCodigoDigitado(novoCodigo);

    const templateParams = {
      to_email: emailRecuperacao,
      codigo: novoCodigo,
      from_name: "Maritia"
    };

    emailjs.send('service_ogzhiak', 'template_t7hwiok', templateParams)
      .then(() => setEtapa(2))
      .catch((err) => {
        console.error("Erro EmailJS:", err);
        alert("Erro ao invocar Maritia: " + (err.text || err.message));
      });
  };

  const validarCodigo = () => {
    if (inputCodigo === codigoDigitado) {
      setEtapa(3);
    } else {
      alert("Código incorreto! As memórias de Maritia não batem.");
    }
  };

  const finalizarRecuperacao = () => {
    if (!emailRecuperacao) return;

    sendPasswordResetEmail(auth, emailRecuperacao)
      .then(() => {
        setMensagemSucesso(`✨ O portal enviou o link para ${emailRecuperacao}. Verifique sua caixa de entrada e também o SPAM!`);
        setMensagemErro("");
        setTimeout(() => {
          setModalRecuperar(false);
          setEtapa(1);
          setMensagemSucesso('');
          setEmailRecuperacao('');
        }, 6000);
      })
      .catch((error) => {
        setMensagemErro("A névoa impediu o envio: " + error.message);
      });
  };

  return (
    <>
      <div className='counter'>
        <div className="auth-container">
          <div className='are0'>
            <img src={lgmaritia} alt="Maritia" style={{ width: '700px' }} />
          </div>

          <div className="auth-box">
            <h2>{modo === 'login' ? 'Entrar na Ficha' : 'Nova Conta'}</h2>
            {mensagemErro && <div className="error-message">{mensagemErro}</div>}
            {mensagemSucesso && <div className="success-message" style={{color: '#4CAF50'}}>{mensagemSucesso}</div>}

            <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />

            <button onClick={acaoPrincipal}>{modo === 'login' ? 'Entrar' : 'Criar Conta'}</button>

            {modo === 'login' && (
              <p className="auth-link" style={{marginTop: '10px', fontSize: '13px', opacity: 0.7, cursor: 'pointer'}} onClick={() => setModalRecuperar(true)}>
                Esqueci minha senha
              </p>
            )}

            <p className="auth-link" style={{cursor: 'pointer'}} onClick={() => setModo(modo === 'login' ? 'cadastro' : 'login')}>
              {modo === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça Login'}
            </p>
          </div>
        </div>
      </div>

      {modalRecuperar && (
        <div className="modal-sobrepor">
          <div className="modal-conteudo">
            {etapa === 1 && (
              <>
                <h3>Recuperar Acesso</h3>
                <p>Informe seu e-mail para receber o código de Maritia.</p>
                <input type="email" placeholder="Seu e-mail" value={emailRecuperacao} onChange={(e) => setEmailRecuperacao(e.target.value)} className="input-modal" style={{ color:'white', width:'200px', height: '26px', borderRadius: '5px'}}/>
                <button onClick={enviarCodigoEmail}>ENVIAR CÓDIGO</button>
              </>
            )}

            {etapa === 2 && (
              <>
                <h3>Verifique seu E-mail</h3>
                <p>Digite o código enviado para {emailRecuperacao}</p>
                <input type="text" placeholder="Digite o código" value={inputCodigo} onChange={(e) => setInputCodigo(e.target.value)} className="input-modal" style={{ color:'white', width:'200px', height: '26px', borderRadius: '5px'}} />
                <button onClick={validarCodigo}>VERIFICAR</button>
              </>
            )}

            {etapa === 3 && (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h3>Restauração de Memórias</h3>
                {mensagemSucesso ? (
                  <p style={{ color: '#4CAF50', fontWeight: 'bold' }}>{mensagemSucesso}</p>
                ) : (
                  <>
                    <p>Identidade confirmada! Maritia enviará um link oficial de redefinição para: <br/><strong>{emailRecuperacao}</strong></p>
                    <button onClick={finalizarRecuperacao}>ENVIAR LINK OFICIAL</button>
                  </>
                )}
              </div>
            )}

            <button className="btn-cancelar" onClick={() => {setModalRecuperar(false); setEtapa(1); setMensagemErro('');}} style={{marginTop: '15px'}}>
              Voltar
            </button>
            {mensagemErro && <p style={{ color: '#ff4d4d', fontSize: '12px', marginTop: '10px' }}>{mensagemErro}</p>}
          </div>
        </div>
      )}
    </>
  );
}

export default App;