# language: pt
@ui @progressbar
Funcionalidade: Progress Bar

  Cenário: Parar a progress bar antes dos 25% e resetar ao completar
    Dado que eu acesso o site do DemoQA
    E eu escolho a opção "Widgets" na página inicial
    E eu clico no submenu "Progress Bar"
    Quando eu inicio a progress bar e paro antes dos 25%
    Então o valor da progress bar deve ser menor ou igual a 25%
    Quando eu inicio a progress bar novamente até chegar aos 100%
    Então a progress bar deve estar em 100%
    Quando eu reseto a progress bar
    Então a progress bar deve voltar para 0%
