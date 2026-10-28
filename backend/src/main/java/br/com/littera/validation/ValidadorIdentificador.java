package br.com.littera.validation;

public class ValidadorIdentificador {

    private ValidadorIdentificador() {
        // Impede a criação de objetos desta classe utilitária.
    }

    public static String normalizar(String identificador) {
        if (identificador == null) {
            return "";
        }

        return identificador
                .replaceAll("[^0-9Xx]", "")
                .toUpperCase();
    }

    public static boolean validarISBN(String isbn) {
        String identificador = normalizar(isbn);

        if (identificador.length() == 10) {
            return validarISBN10(identificador);
        }

        if (identificador.length() == 13) {
            return validarISBN13(identificador);
        }

        return false;
    }

    private static boolean validarISBN10(String isbn) {
        int soma = 0;

        for (int i = 0; i < 10; i++) {
            char caractere = isbn.charAt(i);
            int digito;

            if (i == 9 && caractere == 'X') {
                digito = 10;
            } else if (Character.isDigit(caractere)) {
                digito = Character.getNumericValue(caractere);
            } else {
                return false;
            }

            soma += digito * (10 - i);
        }

        return soma % 11 == 0;
    }

    private static boolean validarISBN13(String isbn) {
        if (!isbn.matches("\\d{13}")) {
            return false;
        }

        int soma = 0;

        for (int i = 0; i < 12; i++) {
            int digito = Character.getNumericValue(isbn.charAt(i));

            soma += digito * (i % 2 == 0 ? 1 : 3);
        }

        int digitoVerificador = (10 - (soma % 10)) % 10;

        return digitoVerificador
                == Character.getNumericValue(isbn.charAt(12));
    }

    public static boolean validarISSN(String issn) {
        String identificador = normalizar(issn);

        if (!identificador.matches("\\d{7}[\\dX]")) {
            return false;
        }

        int soma = 0;

        for (int i = 0; i < 7; i++) {
            int digito = Character.getNumericValue(identificador.charAt(i));

            soma += digito * (8 - i);
        }

        int resultado = (11 - (soma % 11)) % 11;
        char digitoVerificador = resultado == 10
                ? 'X'
                : Character.forDigit(resultado, 10);

        return identificador.charAt(7) == digitoVerificador;
    }
}