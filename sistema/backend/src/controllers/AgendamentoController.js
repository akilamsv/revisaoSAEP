import pool from "../config/Database.js";
import cryptoService from "../utils/crypto.js";

class AgendamentoController {
  async listar(req, res) {
    const { ordernarPor } = req.query; // dia, mes, ano
    try {
      let orderByClause = `ORDER BY DATE (a.data_agendamento) ASC, a.data_agendamento ASC;`;
      if (ordernarPor === "mes") {
        orderByClause = `ORDER BY MONTH (a.data_agendamento) ASC, a.data_agendamento ASC;`;
      } else if (ordernarPor === "ano") {
        orderByClause = `ORDER BY YEAR (a.data_agendamento) ASC, a.data_agendamento ASC;`;
      }

      const sql = `select 
	                  a.id, a.data_agendamento, a.descricao_servico, a.status, c.id AS ID_CLIENTE, c.nome as NOME_CLIENTE, c.cpf as CPF_CLIENTE, c.telefone as TELEFONE_CLIENTE, c.email as EMAIL_CLIENTE, v.id as ID_VEICULO, v.placa as PLACA_VEICULO, v.modelo as MODELO_VEICULO, v.marca as MARCA_VEICULO, v.ano as ANO_VEICULO
                    from agendamentos a 
                      join veiculos v 
	                      on a.veiculo_id = v.id
                      join clientes c 
	                      on v.cliente_id = c.id
                    ${orderByClause}`;

      const [rows] = await pool.query(sql);

      rows.forEach(row => {
        row.cpf_cliente = cryptoService.decrypt(row.cpf_cliente);
      });
      // const agendamentos = rows.map(row => ({
      //   id: row.id,
      //   data_agendamento: row.data_agendamento,
      //   descricao_servico: row.descricao_servico,
      //   status: row.status,
      //   veiculo_id: row.veiculo_id,
      //   cliente_id: row.cliente_id,
      //   cliente_nome: row.cliente_nome,
      // }));

      return res.json(rows);
    } catch (error) {
      console.error("Erro ao listar os agendamentos: ", error);
      return res.status(500).json({
        error: "Erro ao buscar clientes",
        errorMessage: error.message,
      });
    }
  }

  async criar(req, res) {
    const { data_agendamento, descricao_servico, veiculo_id, status } = req.body;
    if (!data_agendamento || !descricao_servico || !veiculo_id) {
      return res.status(400).json({message: 'Todos os dados são obrigatórios'});
    }

    try {
      const [result] = await pool.query(
        `INSERT INTO agendamentos (data_agendamento, descricao_servico, veiculo_id, status) VALUES (?,?,?,?);`,
        [data_agendamento, descricao_servico, parseInt(veiculo_id, 10), status || 'Agendado']
      );

      return res.status(201).json({
        message: 'Agendamento cadastrado com sucesso',
        id: result.insertId
      })
      
    } catch (error) {
      console.error(error);
      return res.status(500).json(
        {
        message: 'Erro ao cadastrar agendamento', 
        errorMessage:error.message
      }
      );
    }
  }


  async atualizarData(req, res) {
    const {id} = req.params;
    const {nova_data} = req.body

    if (!nova_data) {
      return res.status(400).json({
        error:"Informe a nova data para atualização"
      })
    }

    try {
      const [result] = await pool.query(
        `UPDATE agendamentos SET data_agendamento = ? WHERE id = ?`,
        [nova_data, id]
      )

      if(result.affectedRows === 0){
        return res.status(400).json({
          error: "Agendamento não encontrado."
        });
      }

      return res.status(200).json({
        message: "Data do agendamento atualizada com sucesso no DB."
      })
    } catch (error) {
      console.error("Erro ao atualizar data do agendamento", error);
      return res.status(500).json({
        error: "Erro ao salvar nova data no banco"
      })
    }
  }
}

export default new AgendamentoController();
