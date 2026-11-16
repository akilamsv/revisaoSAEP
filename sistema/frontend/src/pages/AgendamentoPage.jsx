import { useEffect, useState } from "react";
import AgendamentoForm from "../components/AgendamentoForm";
import AlterarDataForm from "../components/AlterarDataFOrm";

// const veiculosMockados = [
//   {
//     id: 1,
//     placa: "ABC-1234",
//     modelo: "Palio",
//     marca: "Fiat",
//     ano: 2008,
//     clienteId: 1,
//   },
//   {
//     id: 2,
//     placa: "XYZ-4321",
//     modelo: "Civic",
//     marca: "Honda",
//     ano: 2011,
//     clienteId: 2,
//   },
// ];

// const agendamentosMockados = [
//   {
//     id: 1,
//     veiculoId: 1,
//     dataAgendamento: "2026-10-31T09:00:00",
//     descricaoServico: "Troca de óleo",
//     status: "Agendado",
//   },
//   {
//     id: 2,
//     veiculoId: 2,
//     dataAgendamento: "2026-10-31T14:30:00",
//     descricaoServico: "Alinhamento e balanceamento",
//     status: "Agendado",
//   },
// ];


export default function AgendamentoPage() {

  const [agendamentos, setAgendamentos] = useState([]);
  const [veiculos, setVeiculos] = useState([]);

  const [ordenacao, setOrdenacao] = useState("dia");

  const [agendamentoForm, setAgendamentoForm] = useState(null);

  useEffect(() => {

    const buscaAgendamentos = async () => {

      try {

        const resposta = await fetch("http://localhost:3001/api/agendamentos");

        const data = await resposta.json();

        setAgendamentos(data.map(agendamento => ({
          ...agendamento,
          veiculoId: agendamento.veiculoId ?? agendamento.veiculo_id,
          dataAgendamento: agendamento.dataAgendamento ?? agendamento.data_agendamento,
          descricaoServico: agendamento.descricaoServico ?? agendamento.descricao_servico
        })));

      } catch (error) {
        console.error("Erro ao buscar agendamentos", error);
      }

    };

    buscaAgendamentos();

  }, []);

  useEffect(() => {

    const buscaVeiculos = async () => {

      try {

        const resposta = await fetch("http://localhost:3001/api/veiculos");

        const data = await resposta.json();

        setVeiculos(data);

      } catch (error) {
        console.error("Erro ao buscar veículos", error);
      }

    };

    buscaVeiculos();

  }, []);


  const handleMudarOrdenacao = novaOrdenacao => {
    setOrdenacao(novaOrdenacao);
  };

  const agendamentosOrdenados = [...agendamentos].sort((a, b) => {

    if (ordenacao == "dia") {
      return new Date(a.dataAgendamento) - new Date(b.dataAgendamento);
    }

    if (ordenacao == "mes") {
      return new Date(a.dataAgendamento).getMonth() -
        new Date(b.dataAgendamento).getMonth();
    }

    if (ordenacao == "ano") {
      return new Date(a.dataAgendamento).getFullYear() -
        new Date(b.dataAgendamento).getFullYear();
    }

    return 0;

  });


  const handleSalvar = dadosAgendamento => {

    const novoAgendamento = {
      ...dadosAgendamento,
      id: crypto.randomUUID(),
    };

    setAgendamentos(agendamentos => [...agendamentos, novoAgendamento]);

  };


  const handleSalvarNovaData = novaData => {

    setAgendamentos(agendamentos =>
      agendamentos.map(agendamento => {

        if (agendamento.id == agendamentoForm.id) {
          return {
            ...agendamento,
            dataAgendamento: novaData
          };
        }

        return agendamento;

      })
    );

    setAgendamentoForm(null);

  };

  return (
    <div>

      <h3>Gerenciamento de Agendamentos</h3>

      <AgendamentoForm
        onSalvar={handleSalvar}
        veiculos={veiculos}
      />

      <span>Critério de Ordenação:</span>

      <button onClick={() => handleMudarOrdenacao("dia")}>
        Por Dia
      </button>

      <button onClick={() => handleMudarOrdenacao("mes")}>
        Por Mês
      </button>

      <button onClick={() => handleMudarOrdenacao("ano")}>
        Por Ano
      </button>
{console.log(agendamentos)
}
      <table>

        <thead>
          <tr>
            <th>Data e Horário</th>
            <th>Serviço</th>
            <th>Veículo</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>

          {agendamentosOrdenados.map(agendamento => (

            <tr key={agendamento.id}>

              <td>
                {new Date(agendamento.dataAgendamento).toLocaleDateString("pt-BR")}
                {" | "}
                {new Date(agendamento.dataAgendamento).toLocaleTimeString("pt-BR")}
              </td>

              <td>{agendamento.descricaoServico}</td>

              <td>
                {veiculos.find(veiculo =>
                  veiculo.id == agendamento.ID_VEICULO
                )?.modelo || "Veículo não encontrado"}
              </td>

              <td>
                <button
                  onClick={() => setAgendamentoForm(agendamento)}
                >
                  Alterar Data
                </button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <AlterarDataForm
        isOpen={!!agendamentoForm}
        agendamento={agendamentoForm}
        onSalvar={handleSalvarNovaData}
        onFechar={() => setAgendamentoForm(null)}
      />

    </div>
  );
}
