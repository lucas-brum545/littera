
package com.littera.backend;

import com.littera.backend.controle.EmprestimoControle;
import com.littera.backend.contrato.EmprestimoContrato;
import com.littera.backend.servico.EmprestimoServico;

import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;

public class BackendApplication {

	public static void main(String[] args) throws IOException {


		EmprestimoContrato service = new EmprestimoServico();


		EmprestimoControle controller =
				new EmprestimoControle(service);


		HttpServer servidor = HttpServer.create(
				new InetSocketAddress(8080), 0
		);


		servidor.createContext(
				"/api/emprestimos", controller
		);

		servidor.start();

		System.out.println("Backend Littera iniciado!");
		System.out.println(
				"API: http://localhost:8080/api/emprestimos"
		);
	}
}