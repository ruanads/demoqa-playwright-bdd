# language: pt
@ui @windows
Funcionalidade: Browser Windows

  Cenário: Abrir e fechar uma nova janela
    Dado que eu acesso o site do DemoQA
    E eu escolho a opção "Alerts, Frame & Windows" na página inicial
    E eu clico no submenu "Browser Windows"
    Quando eu clico no botão New Window
    Então uma nova janela deve ser aberta com a mensagem "This is a sample page"
    Quando eu fecho a nova janela
    Então apenas a janela original deve permanecer aberta
