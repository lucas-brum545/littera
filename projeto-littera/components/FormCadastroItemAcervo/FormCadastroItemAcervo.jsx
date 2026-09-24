import { useState } from "react";

export default function FormCadastroItemAcervo(){
    const [tipo, setTipo] = useState('livro'); // 'livro' ou 'revista'
    const [titulo, setTitulo] = useState('');
    const [anoPublicacao, setAnoPublicacao] = useState('');

    // campos de livro
    const [autor, setAutor] = useState('');
    const [isbn, setIsbn] = useState('');

    // campos de revista
    const [edicao, setEdicao] = useState('');
    const [mesAnoPublicacao, setMesAnoPublicacao] = useState('');

    // rotinas que armazenam os dados do formulário e enviam para o backend ou para o estado do aplicativo


    const handleSubmit = (e) => {
        e.preventDefault();
        // Aqui você pode fazer a lógica de envio do formulário, como enviar os dados para um servidor ou atualizar o estado do aplicativo
        console.log('Tipo:', tipo);
        console.log('Título:', titulo);
        console.log('Ano de publicação:', anoPublicacao);
        if (tipo === 'livro') {
            console.log('Autor:', autor);
            console.log('ISBN:', isbn);
        }
        if (tipo === 'revista') {
            console.log('Edição:', edicao);
            console.log('Mês/Ano de publicação:', mesAnoPublicacao);
        }
    }


    let revista = <form>
        <label htmlFor="">Edição: 
            <input type="text" />
        </label>
        <label htmlFor="">Mês / ano publicação (MM/AAAA): 
            <input type="text" />
        </label>
    </form>
    let livro = <form action="">
        <label htmlFor="">Autor: 
            <input type="text" />
        </label>
        <label htmlFor="">Número ISBN: 
            <input type="text" />
        </label>
    </form>

    return (
        <>
        <form action="" onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
            {/* 1. Campo de Seleção: Livro ou Revista */}
        <div>
          <label><strong>Tipo de Item:</strong></label>
          <select 
            value={tipo} 
            onChange={(e) => setTipo(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          >
            <option value="livro">Livro</option>
            <option value="revista">Revista</option>
          </select>
        </div>

        {/* 2. Campos Comuns */}
        <div>
          <label>Título:</label>
          <input 
            type="text" 
            value={titulo} 
            onChange={(e) => setTitulo(e.target.value)} 
            required
            style={{ width: '96%', padding: '6px' }}
          />
        </div>

        <div>
          <label>Ano de Publicação:</label>
          <input 
            type="number" 
            value={anoPublicacao} 
            onChange={(e) => setAnoPublicacao(e.target.value)} 
            required
            style={{ width: '96%', padding: '6px' }}
          />
        </div>
        <br/>
        {/* 3. Campos Condicionais para LIVRO */}
        {tipo === 'livro' && (
          <fieldset style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
            <legend>Detalhes do Livro</legend>
            <div style={{ marginBottom: '8px' }}>
              <label>Autor:</label>
              <input 
                type="text" 
                value={autor} 
                onChange={(e) => setAutor(e.target.value)} 
                required={tipo === 'livro'}
                style={{ width: '96%', padding: '6px' }}
              />
            </div>
            <div>
              <label>ISBN:</label>
              <input 
                type="text" 
                value={isbn} 
                onChange={(e) => setIsbn(e.target.value)} 
                required={tipo === 'livro'}
                style={{ width: '96%', padding: '6px' }}
              />
            </div>
          </fieldset>
        )}

        {/* 4. Campos Condicionais para REVISTA */}
        {tipo === 'revista' && (
          <fieldset style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
            <legend>Detalhes da Revista</legend>
            <div>
              <label>Número da Edição:</label>
              <input 
                type="number" 
                value={edicao} 
                onChange={(e) => setEdicao(e.target.value)} 
                required={tipo === 'revista'}
                style={{ width: '96%', padding: '6px' }}
              />
              <label>Mês/Ano de Publicação (MM/AAAA):</label>
              <input 
                type="text" 
                value={mesAnoPublicacao} 
                onChange={(e) => setMesAnoPublicacao(e.target.value)} 
                required={tipo === 'revista'}
                style={{ width: '96%', padding: '6px' }}
              />
            </div>
          </fieldset>
        )}
        <br />
        <button type="submit" style={{ padding: '10px', background: '#007BFF', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Salvar Item
        </button>
        </form>
        </>
    )
}