import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle, Stack, DialogActions, Button, TextField, MenuItem } from "@mui/material";

const TAMANHO_MAXIMO_IMAGEM = 5 * 1024 * 1024;

function limparIdentificador(valor) {
  return String(valor || "")
    .replace(/[^0-9Xx]/g, "")
    .toUpperCase();
}

function validarISBN(valor) {
  const isbn = limparIdentificador(valor);
  if (/^\d{9}[\dX]$/.test(isbn)) {
    const soma = isbn.split("").reduce(
      (total, digito, indice) =>
        total + (digito === "X" ? 10 : Number(digito)) * (10 - indice),
      0
    );
    return soma % 11 === 0;
  }
  if (/^\d{13}$/.test(isbn)) {
    const soma = isbn.split("").reduce(
      (total, digito, indice) =>
        total + Number(digito) * (indice % 2 === 0 ? 1 : 3),
      0
    );
    return soma % 10 === 0;
  }
  return false;
}

function calcularDigitoISSN(seteDigitos) {
  const soma = seteDigitos
    .split("")
    .reduce((total, digito, indice) => total + Number(digito) * (8 - indice), 0);
  const resultado = (11 - (soma % 11)) % 11;
  return resultado === 10 ? "X" : String(resultado);
}

function validarISSN(valor) {
  const issn = limparIdentificador(valor);
  if (!/^\d{7}[\dX]$/.test(issn)) return false;
  return calcularDigitoISSN(issn.slice(0, 7)) === issn[7];
}

function converterCodigoRevista(codigo) {
  const identificador = limparIdentificador(codigo);
  if (identificador.length === 13 && identificador.startsWith("977")) {
    const seteDigitos = identificador.slice(3, 10);
    return seteDigitos + calcularDigitoISSN(seteDigitos);
  }
  return identificador;
}

export default function DialogAcervo(props) {
    const item = props.acervoParaEditar;
    
    // Estado unificado do formulário para suportar a busca externa e scanner
    const [formDataItem, setFormDataItem] = useState({
        titulo: item?.titulo || '',
        ano: item?.ano || '',
        tipo: item?.tipo || 'LIVRO',
        localizacao: item?.localizacao || '',
        idioma: item?.idioma || '',
        totalDisponivel: item?.totalDisponivel ?? 1,
        autor: item?.autor || '',
        isbn: item?.isbn || '',
        genero: item?.genero || '',
        edicao: item?.edicao || '',
        issn: item?.issn || '',
        mesAnoPublicacao: item?.mesAnoPublicacao || '',
        capa: item?.capa || '',
        descricao: item?.descricao || '',
    });

    const [carregando, setCarregando] = useState(false);
    const [salvandoImagem, setSalvandoImagem] = useState(false);
    const [scannerAberto, setScannerAberto] = useState(false);
    const [mensagemScanner, setMensagemScanner] = useState("");
    
    const videoRef = useRef(null);
    const controlesScannerRef = useRef(null);
    const scannerAtivoRef = useRef(false);
    const itemRef = useRef(formDataItem);

    useEffect(() => {
        itemRef.current = formDataItem;
    }, [formDataItem]);

    // Rotina do Scanner de Código de Barras (vindo do código do Luiz)
    useEffect(() => {
        if (!scannerAberto) return;
        let cancelado = false;
        let leitor = null;

        async function iniciarScanner() {
            try {
                setMensagemScanner("Carregando leitor de código de barras...");
                const { BrowserMultiFormatReader } = await import("@zxing/browser");
                if (cancelado) return;

                leitor = new BrowserMultiFormatReader();
                setMensagemScanner("Solicitando acesso à câmera...");
                const dispositivos = await BrowserMultiFormatReader.listVideoInputDevices();
                if (cancelado) return;

                if (dispositivos.length === 0) {
                    setMensagemScanner("Nenhuma câmera encontrada.");
                    return;
                }

                const cameraTraseira = dispositivos.find((c) => /back|rear|traseira|environment/i.test(c.label));
                const cameraId = cameraTraseira ? cameraTraseira.deviceId : dispositivos[0].deviceId;

                setMensagemScanner("Aponte a câmera para o código de barras.");

                const controles = await leitor.decodeFromVideoDevice(cameraId, videoRef.current, (resultado) => {
                    if (!resultado || scannerAtivoRef.current) return;
                    scannerAtivoRef.current = true;

                    const codigoLido = resultado.getText();
                    const valorLimpo = limparIdentificador(codigoLido);
                    const ehRevista = itemRef.current.tipo === "REVISTA";

                    setFormDataItem((atual) => ({
                        ...atual,
                        isbn: ehRevista ? converterCodigoRevista(valorLimpo) : valorLimpo,
                        issn: ehRevista ? valorLimpo : atual.issn
                    }));

                    setScannerAberto(false);
                    setMensagemScanner("");
                });

                if (cancelado) {
                    controles.stop();
                    return;
                }
                controlesScannerRef.current = controles;
            } catch (erro) {
                console.error("Erro ao iniciar câmera:", erro);
                if (!cancelado) setMensagemScanner("Não foi possível abrir a câmera. Verifique permissões.");
            }
        }

        iniciarScanner();

        return () => {
            cancelado = true;
            controlesScannerRef.current?.stop();
            controlesScannerRef.current = null;
            scannerAtivoRef.current = false;
        };
    }, [scannerAberto]);

    // Manipulação de Imagem / Capa com limite de 5MB
    function selecionarImagem(event) {
        const arquivo = event.target.files?.[0];
        event.target.value = "";
        if (!arquivo) return;

        if (!arquivo.type.startsWith("image/")) {
            alert("Selecione um arquivo de imagem válido.");
            return;
        }
        if (arquivo.size > TAMANHO_MAXIMO_IMAGEM) {
            alert("A imagem ultrapassa o limite de 5 MB.");
            return;
        }

        setSalvandoImagem(true);
        const leitor = new FileReader();
        leitor.onload = () => {
            setFormDataItem((atual) => ({ ...atual, capa: leitor.result }));
            setSalvandoImagem(false);
        };
        leitor.onerror = () => {
            alert("Erro ao carregar a imagem.");
            setSalvandoImagem(false);
        };
        leitor.readAsDataURL(arquivo);
    }

    // Tradução de descrição em segundo plano
    async function traduzirDescricaoEmSegundoPlano(textoOriginal) {
        if (!textoOriginal?.trim()) return;
        try {
            const resposta = await fetch("/api/traducao/portugues", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ texto: textoOriginal }),
            });
            if (!resposta.ok) return;
            const resultado = await resposta.json();
            const traducao = resultado.traducao?.trim();
            if (!resultado.sucesso || !traducao) return;

            setFormDataItem((atual) => {
                if (!atual.descricao?.trim() || atual.descricao === textoOriginal) {
                    return { ...atual, descricao: traducao };
                }
                return atual;
            });
        } catch (erro) {
            console.error("Erro ao traduzir descrição:", erro);
        }
    }

    // Integração de busca automática com Open Library / Periódicos
    async function buscarDadosExternos() {
        const tipo = formDataItem.tipo;
        const identificador = limparIdentificador(tipo === "LIVRO" ? formDataItem.isbn : formDataItem.issn);

        if (!identificador) {
            alert(tipo === "LIVRO" ? "Informe o ISBN." : "Informe o ISSN.");
            return;
        }

        setCarregando(true);
        try {
            const endpoint = tipo === "LIVRO"
                ? `/api/open-library/isbn/${encodeURIComponent(identificador)}`
                : `/api/periodicos/issn/${encodeURIComponent(identificador)}`;

            const resposta = await fetch(endpoint);
            const resultado = await resposta.json();

            if (!resposta.ok || !resultado.sucesso || !resultado.dados) {
                throw new Error(resultado.erro || resultado.mensagem || "Não foi possível encontrar os dados.");
            }

            const dados = resultado.dados;
            setFormDataItem((atual) => ({
                ...atual,
                titulo: dados.titulo || atual.titulo,
                autor: dados.autor || atual.autor,
                ano: dados.ano || atual.ano,
                genero: dados.genero || atual.genero,
                capa: atual.capa || dados.capa || "",
                descricao: atual.descricao || dados.descricaoOriginal || dados.descricao || "",
                idioma: dados.idioma || atual.idioma,
            }));

            if (tipo === "LIVRO" && !formDataItem.descricao?.trim() && dados.descricaoOriginal?.trim()) {
                traduzirDescricaoEmSegundoPlano(dados.descricaoOriginal);
            }
        } catch (erro) {
            console.error("Erro ao buscar dados:", erro);
            alert("Não foi possível buscar os dados automaticamente.\n\n" + erro.message);
        } finally {
            setCarregando(false);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormDataItem((atual) => ({ ...atual, [name]: value }));
    }

    function limparCampos(){
        const itemLimpo = {
        titulo: '',
        ano: '',
        tipo: 'LIVRO',
        localizacao: '',
        idioma: '',
        totalDisponivel: 1,
        autor: '',
        isbn: '',
        genero: '',
        edicao: '',
        issn: '',
        mesAnoPublicacao: '',
        capa: '',
        descricao: ''
    }
        setFormDataItem(itemLimpo)
    }

    function enviar(event) {
        event.preventDefault();
        
        // Formato exato esperado pelo nosso back-end Java
        const dadosFormatados = {
            titulo: formDataItem.titulo,
            ano: formDataItem.ano ? Number(formDataItem.ano) : null,
            tipo: formDataItem.tipo,
            localizacao: formDataItem.localizacao,
            idioma: formDataItem.idioma,
            totalDisponivel: Number(formDataItem.totalDisponivel || 1),
            capa: formDataItem.capa || null,
            descricao: formDataItem.descricao || null,
            
            // Atributos específicos de Livro
            autor: formDataItem.tipo === "LIVRO" ? formDataItem.autor : null,
            isbn: formDataItem.tipo === "LIVRO" ? formDataItem.isbn : null,
            genero: formDataItem.tipo === "LIVRO" ? formDataItem.genero : null,

            // Atributos específicos de Revista
            edicao: formDataItem.tipo === "REVISTA" ? formDataItem.edicao : null,
            issn: formDataItem.tipo === "REVISTA" ? formDataItem.issn : null,
            mesAnoPublicacao: formDataItem.tipo === "REVISTA" ? formDataItem.mesAnoPublicacao : null,
        };

        props.onSalvar(dadosFormatados);
    }

    return (
        <Dialog open fullWidth maxWidth="sm" sx={{'& .MuiDialog-paper': {borderRadius: '10px', padding: '20px'}}}>
            <DialogTitle>
                {item ? `Editar Item ID: ${item.codigo}` : "Cadastrar Novo Item no Acervo"}
            </DialogTitle>
            <DialogContent>
                <form onSubmit={enviar}>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        

                        {/* Seletor do Tipo de Item */}
                        <TextField
                            select
                            label="Tipo de Item"
                            name="tipo"
                            value={formDataItem.tipo}
                            onChange={(e) => {
                                const novoTipo = e.target.value;
                                setFormDataItem(atual => ({ ...atual, tipo: novoTipo }));
                            }}
                            required
                            variant="outlined"
                            sx={{ background: 'white' }}
                            disabled={!!item}
                        >
                            <MenuItem value="LIVRO">Livro</MenuItem>
                            <MenuItem value="REVISTA">Revista</MenuItem>
                        </TextField>

                        {/* Campo Identificador com suporte a scanner e busca externa */}
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <TextField 
                                label={formDataItem.tipo === "LIVRO" ? "ISBN" : "ISSN"}
                                name={formDataItem.tipo === "LIVRO" ? "isbn" : "issn"}
                                value={formDataItem.tipo === "LIVRO" ? formDataItem.isbn : formDataItem.issn}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setFormDataItem(atual => ({
                                        ...atual,
                                        [formDataItem.tipo === "LIVRO" ? "isbn" : "issn"]: val
                                    }));
                                }}
                                required 
                                fullWidth
                                variant="outlined" 
                                sx={{ background: 'white' }} 
                            />
                            <Button variant="outlined" onClick={() => setScannerAberto(true)} type="button">
                                Câmera
                            </Button>
                            <Button variant="contained" onClick={buscarDadosExternos} disabled={carregando} type="button">
                                {carregando ? "Buscando..." : "Buscar API"}
                            </Button>
                        </div>

                        <TextField 
                            label="Título" 
                            name="titulo" 
                            value={formDataItem.titulo}
                            onChange={handleChange}
                            required 
                            variant="outlined" 
                            sx={{ background: 'white' }} 
                        />

                        <TextField 
                            label="Ano" 
                            name="ano" 
                            type="number" 
                            value={formDataItem.ano}
                            onChange={handleChange}
                            required 
                            variant="outlined" 
                            sx={{ background: 'white' }} 
                        />

                        <TextField 
                            label="Localização" 
                            name="localizacao" 
                            value={formDataItem.localizacao}
                            onChange={handleChange}
                            required 
                            variant="outlined" 
                            sx={{ background: 'white' }} 
                        />

                        <TextField 
                            label="Idioma" 
                            name="idioma" 
                            value={formDataItem.idioma}
                            onChange={handleChange}
                            variant="outlined" 
                            sx={{ background: 'white' }} 
                        />

                        <TextField 
                            label="Total Disponível" 
                            name="totalDisponivel" 
                            type="number" 
                            value={formDataItem.totalDisponivel}
                            onChange={handleChange}
                            variant="outlined" 
                            sx={{ background: 'white' }} 
                        />

                        {/* Campos dinâmicos se for LIVRO */}
                        {formDataItem.tipo === "LIVRO" && (
                            <>
                                <TextField 
                                    label="Autor" 
                                    name="autor" 
                                    value={formDataItem.autor}
                                    onChange={handleChange}
                                    required 
                                    variant="outlined" 
                                    sx={{ background: 'white' }} 
                                />
                                <TextField 
                                    label="Gênero" 
                                    name="genero" 
                                    value={formDataItem.genero}
                                    onChange={handleChange}
                                    required 
                                    variant="outlined" 
                                    sx={{ background: 'white' }} 
                                />
                            </>
                        )}

                        {/* Campos dinâmicos se for REVISTA */}
                        {formDataItem.tipo === "REVISTA" && (
                            <>
                                <TextField 
                                    label="Edição" 
                                    name="edicao" 
                                    value={formDataItem.edicao}
                                    onChange={handleChange}
                                    required 
                                    variant="outlined" 
                                    sx={{ background: 'white' }} 
                                />
                                <TextField 
                                    label="Mês/Ano Publicação (ex: 10/2026)" 
                                    name="mesAnoPublicacao" 
                                    value={formDataItem.mesAnoPublicacao}
                                    onChange={handleChange}
                                    required 
                                    variant="outlined" 
                                    sx={{ background: 'white' }} 
                                />
                            </>
                        )}

                        {/* Gestão de Capa */}
                        <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "8px" }}>
                            <h4>Capa do Item</h4>
                            {formDataItem.capa ? (
                                <img src={formDataItem.capa} alt="Capa" style={{ width: "80px", height: "110px", objectFit: "contain", display: "block", marginBottom: "8px" }} />
                            ) : (
                                <p style={{ fontSize: "12px", color: "#666" }}>Nenhuma capa selecionada.</p>
                            )}
                            <input type="file" accept="image/*" onChange={selecionarImagem} />
                            {salvandoImagem && <p style={{ fontSize: "12px" }}>A carregar imagem...</p>}
                        </div>

                        {/* Descrição / Sinopse */}
                        <div>
                            <label style={{ fontSize: "14px", fontWeight: "bold", color: "#555" }}>
                                {formDataItem.tipo === "REVISTA" ? "Descrição da revista:" : "Descrição/sinopse do livro:"}
                            </label>
                            <textarea
                                name="descricao"
                                value={formDataItem.descricao}
                                onChange={handleChange}
                                rows={4}
                                style={{ width: "100%", padding: "8px", boxSizing: "border-box", resize: "vertical", marginTop: "4px" }}
                            />
                        </div>

                    </Stack>
                    
                    <DialogActions sx={{ mt: 2 }}>
                        <Button type="button" onClick={limparCampos}>Limpar Campos</Button>
                        <Button type="button" onClick={() => props.onCancelar()} sx={{ fontWeight: 'bold', fontFamily: 'Arial' }}>
                            Cancelar
                        </Button>
                        <Button type="submit" color="success" sx={{ fontWeight: 'bold', fontFamily: 'Arial' }}>
                            {item ? "Atualizar" : "Cadastrar"}
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>

            {/* Modal do Scanner de Câmera */}
            {scannerAberto && (
                <div style={{ position: "fixed", inset: 0, zIndex: 2000, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
                    <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", width: "100%", maxWidth: "500px", textAlign: "center" }}>
                        <h3>Ler Código de Barras</h3>
                        <video ref={videoRef} autoPlay muted playsInline style={{ width: "100%", maxHeight: "50vh", background: "#111", borderRadius: "8px" }} />
                        <p>{mensagemScanner}</p>
                        <Button variant="contained" color="error" onClick={() => setScannerAberto(false)}>Fechar Câmera</Button>
                    </div>
                </div>
            )}
        </Dialog>
    );
}