import './fichas.css';
import React, { useState, useEffect } from 'react';
import maritia from './assets/maritia.png';
import brperson from './assets/personagensmrt.png';
import { auth, db } from './firebaseconf';
import { doc, setDoc, getDoc } from "firebase/firestore";

function Ficha() {
  // --- ADICIONADO: Trava de segurança ---
  const [carregado, setCarregado] = useState(false);

  const [personagem, setPersonagem] = useState(() => {
  const salvo = localStorage.getItem('dadosPersonagem');
  return salvo ? JSON.parse(salvo) : {
    foto: null, nome: 'Herói Sem Nome', raca: 'Humano', classes: ['Guerreiro'],
    funcao: 'Tanque', level: 1, xpAtual: 0, xpProximo: 1000, HP: 10, estamina: 30, mana: 15,
    statusAdicionais: [{ nome: 'Armadura', valor: 0 }],
    atributos: { forca: 10, agilidade: 10, destreza: 10, sabedoria: 10, instintoSB: 10, carisma: 10 },
    inventario: [{ nome: ' item ', qtd: 1, desc: 'descreva o item' }],
    skills: [], acertoMinimo: 0, especializacoes: [{ arma: 'Espada', nivel: 0 }],
  }
  });

  const [bordasAtivas, setBordasAtivas] = useState(false);
  const [configAberto, setConfigAberto] = useState(false);
  const [corBordas, setCorBordas] = useState(localStorage.getItem('corBordas') ||'rgb(65, 104, 139)');
  const [corCentro, setCorCentro] = useState(localStorage.getItem('corCentro') || 'rgb(255, 255, 255)');
  const [corTexto, setCorTexto] = useState(localStorage.getItem('corTexto') || '#264364');
  const [corSombra, setCorSombra] = useState(localStorage.getItem('corSombra') ||'#000000');
  const [fundoAtivo, setFundoAtivo] = useState(localStorage.getItem('fundoAtivo') ||'https://usagif.com/wp-content/uploads/gifs/water-66.gif');

  const salvarFicha = async () => {
    // --- ADICIONADO: Bloqueia o salvamento se ainda estiver carregando ---
    if (!carregado) return;

    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "usuarios", user.uid);
      try {
        await setDoc(userRef, { 
          ficha: personagem, corTexto, corBordas, corCentro, fundoAtivo, corSombra, bordasAtivas
        }, { merge: true });
        console.log("✨ Sincronizado com Maritia!");
      } catch (e) {
        console.error("Erro ao salvar:", e);
      }
    }
  };

  useEffect(() => {
    localStorage.setItem('dadosPersonagem', JSON.stringify(personagem));
    salvarFicha();
  }, [personagem]);

  useEffect(() => {localStorage.setItem('bordasAtivas', bordasAtivas); salvarFicha();}, [bordasAtivas]);
  useEffect(() => { localStorage.setItem('corTexto', corTexto); salvarFicha(); }, [corTexto]);
  useEffect(() => { localStorage.setItem('corBordas', corBordas); salvarFicha(); }, [corBordas]);
  useEffect(() => { localStorage.setItem('corCentro', corCentro); salvarFicha(); }, [corCentro]);
  useEffect(() => { localStorage.setItem('fundoAtivo', fundoAtivo); salvarFicha(); }, [fundoAtivo]);
  useEffect(() => { localStorage.setItem('corSombra', corSombra); salvarFicha(); }, [corSombra]);

  const estiloPainel = { backgroundColor: corCentro, borderColor: bordasAtivas ? corBordas : 'transparent', borderStyle: 'solid', borderWidth: '2px', color: corTexto, boxShadow: `0px 0px 15px ${corSombra}`, transition: '0.3s' };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setPersonagem(prev => ({ ...prev, foto: reader.result })); };
      reader.readAsDataURL(file);
    }
  };

  const adicionarStatus = () => setPersonagem(prev => ({ ...prev, statusAdicionais: [...prev.statusAdicionais, { nome: 'Novo Status', valor: 0 }] }));
  const mudarStatusAdicional = (index, campo, valor) => {
    const novosStatus = [...personagem.statusAdicionais];
    novosStatus[index][campo] = valor;
    setPersonagem(prev => ({ ...prev, statusAdicionais: novosStatus }));
  };
  const removerStatusAdicional = (index) => setPersonagem(prev => ({ ...prev, statusAdicionais: personagem.statusAdicionais.filter((_, i) => i !== index) }));
  const adicionarClasse = () => setPersonagem(prev => ({ ...prev, classes: [...prev.classes, 'Nova Classe'] }));
  const mudarClasse = (index, valor) => {
    const novasClasses = [...personagem.classes]; novasClasses[index] = valor;
    setPersonagem(prev => ({ ...prev, classes: novasClasses }));
  };
  const removerClasse = (index) => setPersonagem(prev => ({ ...prev, classes: personagem.classes.filter((_, i) => i !== index) }));
  const handleChange = (e) => setPersonagem(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const adicionarSkill = (tipo) => setPersonagem(prev => ({ ...prev, skills: [...prev.skills, { id: Date.now(), tipo, nome: 'Nova Skill', descricao: '' }] }));
  const atualizarSkill = (id, campo, valor) => setPersonagem(prev => ({ ...prev, skills: personagem.skills.map(s => s.id === id ? { ...s, [campo]: valor } : s) }));
  const removerSkill = (id) => setPersonagem(prev => ({ ...prev, skills: personagem.skills.filter(s => s.id !== id) }));

  const backgroundsPredefinidos = [
    'https://usagif.com/wp-content/uploads/gifs/water-66.gif',
    'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnh2cWI5M2hjc2phczQ0cXRyN3UwYWQ2YTFrcTRqdXkyYXlra200byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7buijTqhjxjbEqjK/giphy.gif',
    'https://i.gifer.com/Vs69.gif', 'https://i.gifer.com/YWuH.gif', 'https://i.pinimg.com/originals/36/11/d3/3611d3ced99c00a150cdc4d3bcfa1fa9.gif',
    'https://66.media.tumblr.com/7d7916290ee905bba571911f6f168680/7450bd2ea56fb971-5a/s1280x1920/a51b66e5b81af9b2ccb3712c4ae929c23d7b0e19.gif',
    'https://i1.wp.com/68.media.tumblr.com/721ccdabadc28bb5c16763664eece09c/tumblr_oo16p27mG71w4oiizo1_540.gif',
    'https://gifdb.com/images/high/jun-naruse-bus-anime-loop-t0urovmtc02uz0ga.gif',
  ];

  const [modalResetAberto, setModalResetAberto] = useState(false);

  const estiloCampo = {
    backgroundColor: 'rgba(0, 0, 0, 0)', border: 'none', borderRadius: '5px', color: corTexto,
    boxShadow: `inset 900px 0px 0px rgba(0,0,0,0.12), 0px 2px 5px ${corSombra}44`, outline: 'none', transition: '0.3s',
  };

  useEffect(() => {
    const carregarDadosIndividuais = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const dadosRecuperados = docSnap.data();
          if (dadosRecuperados.ficha) setPersonagem(dadosRecuperados.ficha);
          if (dadosRecuperados.corTexto) setCorTexto(dadosRecuperados.corTexto);
          if (dadosRecuperados.corBordas) setCorBordas(dadosRecuperados.corBordas);
          if (dadosRecuperados.corCentro) setCorCentro(dadosRecuperados.corCentro);
          if (dadosRecuperados.fundoAtivo) setFundoAtivo(dadosRecuperados.fundoAtivo);
          if (dadosRecuperados.corSombra) setCorSombra(dadosRecuperados.corSombra);
          if (dadosRecuperados.bordasAtivas !== undefined) setBordasAtivas(dadosRecuperados.bordasAtivas);
          console.log("Memórias de Maritia recuperadas!");
        }
      }
      // --- ADICIONADO: Autoriza o salvamento agora que o load acabou ---
      setCarregado(true);
    };
    carregarDadosIndividuais();
  }, []);

const handleLogout = async () => {
  try {
    await auth.signOut();
    // Em vez de dar reload, apenas deixe o Firebase avisar ao App.jsx que o usuário saiu
    // Se ainda assim não mudar a tela, use o redirecionamento forçado:
    window.location.href = "/"; // Isso força a volta para a raiz do projeto
  } catch (error) {
    console.error("Erro ao sair:", error);
  }
};

const estiloTitulo = {
  color: corTexto,
  fontWeight: 'bold',
  textShadow: `1px 1px 3px rgba(0, 0, 0, 0.3)`, // Sombra leve e suave
  marginBottom: '5px',
  display: 'block' // Garante que o título fique acima do campo
};

  return (
    <>

{/* BOTÃO SIMPLES E INDEPENDENTE */}
    <div style={{ width: '100%', position: 'absolute', zIndex: 10 }}>
      <button 
        onClick={handleLogout} 
        style={{
          margin: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          border: `1px solid ${corBordas}`,
          padding: '8px 15px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
          backdropFilter: 'blur(5px)',
        }}
      >
        ⬅ SAIR
      </button>
    </div>

      <div className='areTOP' style={{ backgroundImage: `url(${fundoAtivo})` }}>
        <img src={maritia} alt="maritia" style={{ width: '750px' }} />

      </div>

      <div className='counter2' style={{ backgroundImage: `url(${fundoAtivo})` }}>
        <div className='are2'> <img src={brperson} alt="persons" /></div>
        <div className='are1' style={{ backgroundColor: 'transparent', border: 'none' }}>
          <div className='coisas1 header-personagem' style={estiloPainel}>
            <div className="foto-container">
              <label htmlFor="upload-foto">
                <div className="circulo-foto" style={{ backgroundImage: personagem.foto ? `url(${personagem.foto})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', borderColor: corBordas, borderStyle: 'solid', borderWidth: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {!personagem.foto && <span style={{ color: corTexto, fontWeight: 'bold' }}>+ Foto</span>}
                </div>
              </label>
              <input type="file" id="upload-foto" onChange={handleFoto} style={{ display: 'none' }} accept="image/*" />
            </div>

            <div className="dados-principais">
              <div className="campo-input"><span style={estiloTitulo}>Nome</span><input name="nome" value={personagem.nome} onChange={handleChange} style={{ ...estiloCampo, color: corTexto, borderColor: corBordas, borderStyle: 'solid', borderWidth: '1px' }} /></div>
              <div className="linha-dupla">
                <div className="campo-input"><span style={estiloTitulo}>Raça</span><input name="raca" value={personagem.raca} onChange={handleChange} style={{ ...estiloCampo, color: corTexto, borderColor: corBordas, borderStyle: 'solid', borderWidth: '1px' }} /></div>
                <div className="campo-input"><span style={estiloTitulo}>Função</span><input name="funcao" value={personagem.funcao} onChange={handleChange} style={{ ...estiloCampo, color: corTexto, borderColor: corBordas, borderStyle: 'solid', borderWidth: '1px' }} /></div>
              </div>
              <div className="campo-input">
                <div style={{ color: corTexto, display: 'flex', alignItems: 'center', gap: '8px' }}><span style={estiloTitulo}>Classes</span><button onClick={adicionarClasse} className="btn-add">+</button></div>
                <div className="lista-classes">
                  {personagem.classes.map((classe, i) => (
                    <div key={i} className="item-classe">
                      <input value={classe} onChange={(e) => mudarClasse(i, e.target.value)} style={{ ...estiloCampo, color: corTexto, borderColor: corBordas, borderStyle: 'solid', borderWidth: '1px' }} />
                      <button className="btn-remover" onClick={() => removerClasse(i)} style={{ background: 'rgb(255, 0, 0)', color: '#ffffff', borderRadius: '6px', height: '22px', width: '22px', border: 'none' }}>×</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="xp-container">
                <div className="campo-input"><span style={estiloTitulo}>Level</span><input type="number" name="level" value={personagem.level} onChange={handleChange} className="input-curto" style={{ ...estiloCampo, color: corTexto, borderColor: corBordas, borderStyle: 'solid', borderWidth: '1px' }} /></div>
                <div className="xp-inputs">
                <span style={estiloTitulo}>XP OBTIDO / ALCANÇAR</span>
                  <div className="flex-row">
                    <input type="number" name="xpAtual" value={personagem.xpAtual} onChange={handleChange} style={{ ...estiloCampo, color: corTexto, borderColor: corBordas, borderStyle: 'solid', borderWidth: '1px' }} />
                    <span style={{ color: corTexto }}>/</span>
                    <input type="number" name="xpProximo" value={personagem.xpProximo} onChange={handleChange} style={{ ...estiloCampo, color: corTexto, borderColor: corBordas, borderStyle: 'solid', borderWidth: '1px' }} />
                  </div>
                </div>
              </div>
              <div className="campo-input" style={{ marginTop: '10px' }}><span style={estiloTitulo}>Dado de Acerto Mínimo</span><input type="number" value={personagem.acertoMinimo} className="input-curto" style={{ ...estiloCampo, color: corTexto, textAlign: 'center', fontSize: '15px', fontWeight: 'bold', width: '60px', borderColor: corBordas, borderStyle: 'solid', borderWidth: '1px' }} onChange={(e) => setPersonagem({ ...personagem, acertoMinimo: e.target.value })} /></div>
              <hr style={{ border: `0.5px solid ${corBordas}`, opacity: 0.2, margin: '15px 0' }} />
              <div className="especializacoes-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}><span style={estiloTitulo}>Especialização de Armas</span><button onClick={() => setPersonagem({ ...personagem, especializacoes: [...personagem.especializacoes, { arma: 'Espada', nivel: 0, custom: false }] })} className="btn-add"> + </button></div>
                {personagem.especializacoes.map((esp, index) => (
                  <div key={index} style={{ ...estiloCampo, display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
                    {!esp.custom ? (
                      <select value={esp.arma} style={{ background: 'transparent', color: corTexto, border: 'solid', flex: 1, padding: '8px', borderRadius: '4px', borderColor: corBordas, borderWidth: '1px' }} onChange={(e) => { const novas = [...personagem.especializacoes]; if (e.target.value === "Outro...") { novas[index].custom = true; novas[index].arma = ""; } else { novas[index].arma = e.target.value; } setPersonagem({ ...personagem, especializacoes: novas }); }}>
                        <option value="Espada">Espada</option><option value="Machado">Machado</option><option value="Lança">Lança</option><option value="Adaga">Adaga</option><option value="Martelo">Martelo</option><option value="Arma de Fogo">Arma de Fogo</option><option value="Arremessável">Arremessável</option><option value="Arco">Arco</option><option value="Besta">Besta</option><option value="Outro...">+ Outro...</option>
                      </select>
                    ) : (
                      <div style={{ flex: 1, display: 'flex', gap: '4px' }}>
                        <input placeholder="Qual arma?" value={esp.arma} style={{ background: 'rgba(0,0,0,0.3)', color: corTexto, border: `1px solid ${corBordas}`, flex: 1, padding: '8px', borderRadius: '4px' }} onChange={(e) => { const novas = [...personagem.especializacoes]; novas[index].arma = e.target.value; setPersonagem({ ...personagem, especializacoes: novas }); }} />
                        <button onClick={() => { const novas = [...personagem.especializacoes]; novas[index].custom = false; novas[index].arma = "Espada"; setPersonagem({ ...personagem, especializacoes: novas }); }} style={{ background: 'rgba(255,255,255,0.1)', color: corTexto, border: 'none', borderRadius: '4px' }}> 📋 </button>
                      </div>
                    )}
                    <input type="number" value={esp.nivel} style={{ background: 'rgba(0,0,0,0.5)', color: corTexto, border: `1px solid ${corBordas}`, width: '50px', textAlign: 'center', padding: '8px', borderRadius: '4px', borderWidth: '2px' }} onChange={(e) => { const novas = [...personagem.especializacoes]; novas[index].nivel = e.target.value; setPersonagem({ ...personagem, especializacoes: novas }); }} />
                    <button style={{ background: 'rgb(255, 0, 0)', color: '#ffffff', borderRadius: '6px', height: '22px', width: '22px', border: 'none' }} onClick={() => setPersonagem({ ...personagem, especializacoes: personagem.especializacoes.filter((_, i) => i !== index) })}> × </button>
                  </div>
                ))}
              </div>
            </div>

            <div className='coisas2' style={estiloPainel}>
              <div className="status-titulo"><span style={estiloTitulo}>Status</span><button onClick={adicionarStatus} className="btn-add-status">+</button> </div>
              <div className="status-grid">
                <div className="campo-input-status"><label>HP</label><input type="number" name="HP" value={personagem.HP} onChange={handleChange} className="input-curto" style={{ ...estiloCampo, color: corTexto, border: `1px solid ${corBordas}` }} /></div>
                <div className="campo-input-status"><label>MANA</label><input type="number" name="mana" value={personagem.mana} onChange={handleChange} className="input-curto" style={{ ...estiloCampo, color: corTexto, border: `1px solid ${corBordas}` }} /></div>
                <div className="campo-input-status"><label>ESTAMINA</label><input type="number" name="estamina" value={personagem.estamina} onChange={handleChange} className="input-curto" style={{ ...estiloCampo, color: corTexto, border: `1px solid ${corBordas}` }} /></div>
                {personagem.statusAdicionais.map((st, index) => (
                  <div key={index} className="campo-input-status">
                    <input type="text" value={st.nome} onChange={(e) => mudarStatusAdicional(index, 'nome', e.target.value)} className="input-nome-status" style={{ ...estiloCampo, color: corTexto, border: `1px solid ${corBordas}` }} />
                    <input type="number" value={st.valor} onChange={(e) => mudarStatusAdicional(index, 'valor', e.target.value)} className="input-curto" style={{ ...estiloCampo, color: corTexto, border: `1px solid ${corBordas}` }} />
                    <button onClick={() => removerStatusAdicional(index)} className="btn-remover" style={{ background: 'rgb(255, 0, 0)', color: '#ffffff', borderRadius: '6px', height: '22px', width: '22px', border: 'none' }}>×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="secao-inferior">
            <div className="coisas3 painel-atributos" style={estiloPainel}>
              <span style={estiloTitulo}>ATRIBUTOS</span>
              <div className="grid-attr">
                {Object.keys(personagem.atributos).map((attr) => (
                  <div key={attr} className="attr-item" style={{ ...estiloCampo, display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'transparent', border: 'solid', borderRadius: '10px', borderColor: corBordas, borderWidth: '2px' }}>
                    <label style={{ color: corTexto, marginBottom: '5px' }}>{attr.toUpperCase()}</label>
                    <input type="number" value={personagem.atributos[attr]} style={{ backgroundColor: 'rgba(0,0,0,0.2)', color: corTexto, fontSize: '22px', fontWeight: 'bold', textAlign: 'center', border: 'none', width: '60px', borderRadius: '5px', outline: 'none' }} onChange={(e) => setPersonagem({ ...personagem, atributos: { ...personagem.atributos, [attr]: e.target.value } })} />
                  </div>
                ))}
              </div>
            </div>

            <div className="coisas3 painel-inventario" style={{ ...estiloPainel, backgroundColor: corCentro, borderColor: bordasAtivas ? corBordas : 'transparent', borderStyle: 'solid', overflow: 'visible' }}>
              <div className="inv-header" style={{ color: corTexto }}><span style={estiloTitulo}>INVENTARIO</span><button onClick={() => setPersonagem({ ...personagem, inventario: [...personagem.inventario, { nome: '', qtd: 1, desc: '' }] })} className='btn-add-status'> + Item </button></div>
              <div className="lista-inv">
                {personagem.inventario.map((item, index) => (
                  <div key={index} className="item-inv" style={{ ...estiloCampo, display: 'flex', gap: '10px', alignItems: 'center', background: 'transparent', border: `1px solid ${corBordas}`, padding: '8px', borderRadius: '8px', marginBottom: '8px' }}>
                    <input placeholder="Nome do item" value={item.nome} style={{ background: 'transparent', color: corTexto, border: 'none', flex: 2, outline: 'none' }} onChange={(e) => { const novoInv = [...personagem.inventario]; novoInv[index].nome = e.target.value; setPersonagem({ ...personagem, inventario: novoInv }); }} />
                    <input type="number" className="input-qtd" value={item.qtd} style={{ background: 'transparent', color: corTexto, border: `1px solid ${corBordas}`, width: '50px', textAlign: 'center', borderRadius: '4px', outline: 'none', height: '30px' }} onChange={(e) => { const novoInv = [...personagem.inventario]; novoInv[index].qtd = e.target.value; setPersonagem({ ...personagem, inventario: novoInv }); }} />
                    <textarea placeholder="Descrição..." value={item.desc} style={{ background: 'transparent', color: corTexto, border: 'none', flex: 3, resize: 'none', outline: 'none', height: '30px' }} onChange={(e) => { const novoInv = [...personagem.inventario]; novoInv[index].desc = e.target.value; setPersonagem({ ...personagem, inventario: novoInv }); }} />
                    <button className="btn-del" style={{ background: 'transparent', color: corTexto, border: 'solid', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setPersonagem({ ...personagem, inventario: personagem.inventario.filter((_, i) => i !== index) })}>×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='coisas3 area-skills' style={estiloPainel}>
            <div className="status-titulo"><span style={estiloTitulo}>SKILLS</span></div>
            <div className="skill-controls">
              {['Magia', 'Traço', 'Herança', 'Habilidade de Classe'].map(t => (
                <button key={t} className="btn-add" onClick={() => adicionarSkill(t)}>+ {t}</button>
              ))}
            </div>
            <div className="skills-grid">
              {personagem.skills.map((skill) => (
                <div key={skill.id} className="skill-card" style={{ ...estiloPainel, backgroundColor: corCentro, opacity: 0.85, marginBottom: '10px', boxShadow: `0px 0px 10px ${corSombra}`, border: `1px solid ${corBordas}`, padding: '15px' }}>
                  <button className="btn-remover-skill" onClick={() => removerSkill(skill.id)}>×</button>
                  <div className="skill-topo-central" style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '5px', padding: '5px' }}>
                    <span className="skill-tipo-label" style={estiloTitulo}>{skill.tipo}</span>
                   <span
  contentEditable
  suppressContentEditableWarning={true}
  onBlur={(e) => atualizarSkill(skill.id, 'nome', e.currentTarget.textContent)}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  }}
  style={{ 
    color: corTexto, 
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
    fontWeight: '900',
    fontSize: '24px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    cursor: 'text',
    display: 'block',
    width: '100%',
    textAlign: 'center',
    outline: 'none'
  }}
>
  {skill.nome}
</span>
                  </div>
                  <textarea className="skill-desc-grande" value={skill.descricao} placeholder="Descreva o efeito da habilidade..." onChange={(e) => atualizarSkill(skill.id, 'descricao', e.target.value)} style={{ color: corTexto }} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='are2'> <img src={brperson} alt="persons" /></div>
      </div>

      <button className="btn-config-fixo" onClick={() => setConfigAberto(true)}>⚙️</button>

      {configAberto && (
        <div className="overlay-config">
          <div className="modal-config" style={{ border: `2px solid ${corBordas}`, boxShadow: `0px 0px 20px ${corSombra}` }}>
            <button className="fechar-modal" onClick={() => setConfigAberto(false)}>×</button>
            <h2>Configurações</h2>
            <div className="config-grid-opcoes">
              <div className="config-secao"><label>Bordas</label><input type="color" value={corBordas} onChange={(e) => setCorBordas(e.target.value)} /></div>
              <div className="config-secao"><label>Fundo Painel</label><input type="color" value={corCentro} onChange={(e) => setCorCentro(e.target.value)} /></div>
              <div className="config-secao"><label>Texto</label><input type="color" value={corTexto} onChange={(e) => setCorTexto(e.target.value)} /></div>
              <div className="config-secao"><label>Sombra/Glow</label><input type="color" value={corSombra} onChange={(e) => setCorSombra(e.target.value)} /></div>
            </div>
            <button className={`btn-toggle ${bordasAtivas ? 'ligado' : 'desligado'}`} onClick={() => setBordasAtivas(!bordasAtivas)}>
              Bordas: {bordasAtivas ? "ON" : "OFF"}
            </button>
            <div className="grid-fundos">
              {backgroundsPredefinidos.map((bg, i) => (
                <div key={i} className="miniatura-fundo" style={{ backgroundImage: `url(${bg})` }} onClick={() => setFundoAtivo(bg)} />
              ))}
              <div className="config-secao2"><label>Link de Fundo Personalizado</label><input type="text" placeholder="Cole o link do GIF..." style={{ color: 'white', background: 'transparent', border: '1px solid white' }} onChange={(e) => setFundoAtivo(e.target.value)} /></div>
            </div>
            <button onClick={() => setModalResetAberto(true)} style={{ marginTop: '20px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', fontWeight: 'bold', width: '100%' }}>⚠️ RESETAR TODA A FICHA</button>
          </div>
        </div>
      )}

      {modalResetAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
          <div style={{ backgroundColor: corCentro, border: `2px solid ${corBordas}`, padding: '30px', borderRadius: '15px', textAlign: 'center', boxShadow: `0px 0px 20px ${corSombra}`, maxWidth: '400px' }}>
            <h2 style={{ color: corTexto, marginBottom: '15px' }}>⚠️ APAGAR MEMÓRIA?</h2>
            <p style={{ color: corTexto, marginBottom: '25px', lineHeight: '1.5' }}> Viajante, tem certeza? <br /><strong>Todos os seus itens serão perdidos!</strong> </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button onClick={() => setModalResetAberto(false)} style={{ padding: '10px 20px', borderRadius: '5px', border: `1px solid ${corTexto}`, background: 'transparent', color: corTexto }}> CANCELAR </button>
              <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#ff4d4d', color: 'white', fontWeight: 'bold' }}> CONFIRMAR RESET </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Ficha;