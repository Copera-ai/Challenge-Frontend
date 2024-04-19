# Desafio Front-End: Lista de Tarefas



## Requisitos

Neste desafio, você irá construir o Front-End de uma aplicação de lista de tarefas. Nesse desafio, você deve utilizar as seguintes tecnologias:

- React
- TypeScript
- Apollo Client ou react-query
- Material UI (@mui/material)
- dndkit
- tiptap (opcional)



## Desafio

O desafio consiste em construir o Front-End de uma aplicação de lista de tarefas. Este aplicativo tem como objetivo permitir que os usuários gerenciem suas tarefas diárias, podendo adicioná-las, atualizá-las, marcá-las como concluídas e excluí-las conforme necessário. Cada tarefa deve ter um texto descritivo e um status indicando se está pendente ou concluída.



### Funcionalidades

- Lista de Tarefas: Permite que o usuário veja todas as suas tarefas cadastradas. Deve mostrar o conteúdo bem como o status dessa tarefa.
- Filtrar Lista de Tarefas: Permite que o usuário visualize apenas as tarefas marcadas como concluídas.
- Criar Tarefa: O usuário pode criar uma nova tarefa. O conteúdo da tarefa pode ser em markdown, suportando links, títulos, texto em itálico e negrito.
- Editar Tarefa: O usuário pode dar dois cliques em qualquer tarefa na lista e editar o seu conteúdo.
- Reordenar Tarefas: O usuário é livre para ordenar as tarefas como bem entender utilizando drag and drop.


### Extras
- infinite scroll
- Virtualização
- testes com vitest e testing-libeary

## Instruções Gerais

- Não é necessário construir um backend. Este repositório contém uma API GraphQL que você pode utilizar, caso deseje.
- O campo de texto para criar/editar uma tarefa deve suportar edição de texto. Utilize o tiptap para implementar essas funcionalidades.
- Você está livre para usar qualquer outra biblioteca React no seu projeto.
- Você deve utilizar o máximo possível dos componentes e recursos do Material UI.

### Server 

Este repositório é um monorepo que contém o setup inicial de um projeto React utilizando Vite.

Como rodar este servidor:

- Clonar este repositório.
- Instalar as dependências com o comando `yarn`.
- Executar `yarn dev` para subir os servidores de desenvolvimento.

Aqui estão alguns exemplos de operações que este servidor suporta:

```gql
query Todos($input: TodosInput!) {
  todos(input: $input) {
    id
    text
    order
    completed
  }
}

mutation CreateTodos {
    addTodo(text: "todo 1") {
        id
        order
    }
}

mutation DeleteTodo {
    removeTodo(id: "42") {
        id
    }
}

mutation ToggleTodo {
    toggleTodo(id: "2") {
        text
        completed
    }
}


mutation UpdateTodo {
    updateTodo(id: "39", text: "2 uptended 1", order: 12826) {
    id
    text
    order
    }
}
```

> Atenção: o campo `order` é criado no lado do servidor ao criar uma tarefa.


### Salvando a ordem das tarefas 

Ao fazer o arrastar e soltar das tarefas, a ordem da tarefa deve ser calculada no frontend utilizando a ordem dos elementos subjacentes ao índice onde a tarefa deve ficar.

Utilize o seguinte código para determinar a nova ordem da tarefa que foi reordenada:

```ts
export function getPositionForIndex(list: number[], index: number): number {
  if (list.length === 0) {
    return 65536;
  }
  if (index === 0) {
    if (list[index] === undefined) return 65536;
    const order = list[index] <= 0 ? list[index] - 65536 : list[index];
    return parseInt((order / 2).toFixed(), 10);
  }
  if (index === list.length) {
    return list[list.length - 1] + 65536;
  }
  const previewPosition = list[index - 1];
  const nestPosition = list[index];
  return parseInt(((previewPosition + nestPosition) / 2).toFixed(), 10);
}
```


## Instruções de entrega
Você deve disponibilizar o seu projeto em um repositório privado no GitHub e dar acesso de leitura para os usuários `@matheusAle` e `@christiancuri`.