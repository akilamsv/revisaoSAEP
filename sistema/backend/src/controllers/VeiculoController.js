
import pool from "../config/Database.js";

class VeiculoController {
  async listar(req, res) {
    try {
      const [rows] = await pool.query(`
        SELECT v.id, v.modelo, v.marca, v.placa, v.ano, v.cliente_id, c.nome AS NomeCliente
        FROM veiculos v
        JOIN clientes c
          ON v.cliente_id = c.id
        ORDER BY v.id DESC;
      `);

      return res.json(rows);

    } catch (error) {
      console.error("Erro ao listar veículos: ", error);

      return res.status(500).json({
        error: "Erro ao buscar veículos",
        errorMessage: error.message,
      });
    }
  }

  async criar(req, res) {
    const {placa, modelo, marca, ano, cliente_id} = req.body;

    if(!placa || !modelo || !marca || !ano || !cliente_id){
      return res.status(400).json({
        error: "Todos os campos são obrigatórios"
      })
    }

    try {
      const [result] = await pool.query(
        `INSERT INTO veiculos (placa, modelo, marca, ano, cliente_id) VALUES (?,?,?,?,?)`,
        [placa, modelo, marca, ano, cliente_id]
      )

      return res.status(201).json({
        message: "Veiculos cadastrados com sucesso",
        id: result.insertId
      })
    } catch (error) {
      console.error('Erro ao cadastrar veículos', error);
      return res.status(500).json({
        error: "Erro ao salvar veículo no banco de dados"
      });
    }
  }

  
}


export default new VeiculoController();

