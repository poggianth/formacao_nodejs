/* 
O que é buffer?
    - É um espaço na memória do computador usados para transitar dados de uma maneira muito rápida;
    - Os dados armazenados são armazenados no buffer para que sejam tratados rapidamente, enviados para outro lugar e depois removidos do buffer;
    - Guarda os dados maneira binária
    - Recebe uma String e guarda um valor binário
*/

const buf = Buffer.from("ok!");

console.log(buf);