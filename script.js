var canvas;
var context;
var cards = [];
var cardWidth = 75;
var cardHeight = 75;
var timer = -0.01;
var game = 0;
var time = -2;
var cards_active = {active: 0, count: 0, pred: -1, first: -2, second: -2};
var color = {background: '#95A792', shadow: '#596C68', card: '#E3D9CA', text: '#403F48'};
var player_and_bot = {player: 0, bot: 0, move: "player"};
var players = [];
var button = [];
var move_bot = [];
var c_input = 0;
var move = 0;
button[0] = {type: "pause", text: "Продолжить", next: "time_game", x: 359, y: 407, width: 362, height: 98, hover: false};
button[1] = {type: "pause", text: "Меню", next: "menu", x: 359, y: 557, width: 362, height: 98, hover: false};
button[2] = {type: "menu", text: "Играть", next: "select_mode", x: 359, y: 450, width: 362, height: 98, hover: false};
button[3] = {type: "settings", text: "Тема", next: "settings_theme", x: 359, y: 257, width: 362, height: 98, hover: false};
button[4] = {type: "settings", text: "Звук", next: "settings_sound", x: 359, y: 407, width: 362, height: 98, hover: false};
button[5] = {type: "settings", text: "Меню", next: "menu", x: 359, y: 557, width: 362, height: 98, hover: false};
button[6] = {type: "settings_sound", text: "Меню", next: "menu", x: 359, y: 557, width: 362, height: 98, hover: false};
button[7] = {type: "select_mode", text: "На время", next: "rules_first_mode", x: 359, y: 257, width: 362, height: 98, hover: false};
button[8] = {type: "select_mode", text: "С ботом", next: "rules_second_mode", x: 359, y: 407, width: 362, height: 98, hover: false};
button[9] = {type: "select_mode", text: "С друзьями", next: "players_settings", x: 359, y: 557, width: 362, height: 98, hover: false};
button[10] = {type: "players_settings", text: "Начать", next: "rules_third_mode", x: 359, y: 557, width: 362, height: 98, hover: false};
button[11] = {type: "results_first_mode", text: "Новая игра", next: "time_game", x: 359, y: 407, width: 362, height: 98, hover: false};
button[12] = {type: "results_first_mode", text: "Меню", next: "menu", x: 359, y: 557, width: 362, height: 98, hover: false};
button[13] = {type: "results_second_mode", text: "Новая игра", next: "game_with_bot", x: 359, y: 407, width: 362, height: 98, hover: false};
button[14] = {type: "results_second_mode", text: "Меню", next: "menu", x: 359, y: 557, width: 362, height: 98, hover: false};
button[15] = {type: "results_third_mode", text: "Новая игра", next: "game_with_friends", x: 359, y: 407, width: 362, height: 98, hover: false};
button[16] = {type: "results_third_mode", text: "Меню", next: "menu", x: 359, y: 557, width: 362, height: 98, hover: false};
button[17] = {type: "settings_theme", text: "Меню", next: "menu", x: 359, y: 557, width: 362, height: 98, hover: false};
button[18] = {type: "rules_first_mode", text: "Начать", next: "time_game", x: 359, y: 557, width: 362, height: 98, hover: false};
button[19] = {type: "rules_second_mode", text: "Начать", next: "game_with_bot", x: 359, y: 557, width: 362, height: 98, hover: false};
button[20] = {type: "rules_third_mode", text: "Начать", next: "game_with_friends", x: 359, y: 557, width: 362, height: 98, hover: false};

var cards_theme = [];
cards_theme[0] = {x: 70, y: 200, width: 150, height: 220, hover: false, color_card: '#E3D9CA', color_shadow: '#596C68', color_background: '#95A792', color_text: '#403F48'};
cards_theme[1] = {x: 860, y: 200, width: 150, height: 220, hover: false, color_card: '#645C84', color_shadow: '#A2738C', color_background: '#EAAFAF', color_text: '#061E29'};
cards_theme[2] = {x: 465, y: 300, width: 150, height: 220, hover: false, color_card: '#DEFCF9', color_shadow: '#C3BEF0', color_background: '#CADEFC' , color_text: '#64467D'};


var type_table = "menu";
class Input_1 {
  active;
  point;
  text;
  x;
  y;
}
var input = [];
//menu(настройки/играть), settings(назад/тема/звук), theme(?), sound(меню), selection(3 режима)
// mode_two(продолжить), rules(продолжить), game, pause(меню/продолжить/новая игра), end(меню/новая игра)
let img = document.createElement('img');
img.src = 'images/button_green.png';

window.onload = qw();

function mouse_move_card(e)
{
  if (type_table != "game_with_bot" || player_and_bot.move == "player")
  {
    //опускаем карту
    if (cards_active.pred != -1)
      for (var i = 0; i < 30; i++)
        if (cards[i].click_status == 0 && cards[i].status == 1 && cards[i].active == 1)
        {
          down_card(i);
          cards_active.pred = -1;
        }

    //поднятие карты
    for (var j = 0; j < 30; j++)
      if(check_move_card(e, j))
      {

        up_card(j);
        break;
      }
  }
}


function mouse_move_button(e)
{
  for (var i = 0; i < button.length; i++)
  {
    if (button[i].type == type_table)
      if (!button[i].hover && e.offsetX < button[i].x + button[i].width && e.offsetX > button[i].x
      && e.offsetY > button[i].y && e.offsetY < button[i].y + button[i].height)
      {
        make_button(i, true);
        button[i].hover = true;
      }
      else if (button[i].hover && ((e.offsetX > button[i].x + button[i].width || e.offsetX < button[i].x)
      || (e.offsetY < button[i].y || e.offsetY > button[i].y + button[i].height)))
      {
        make_button(i, false);
        button[i].hover = false;
      }
  }
}


function mouse_move(e)
{
  if (type_table.indexOf("game") != -1)
      mouse_move_card(e);
  else if (type_table == "settings_theme")
  {
    console.log('мы тут ', e)
    mouse_move_cards_theme(e);
  }
  else if (type_table.indexOf("game") == -1)
    mouse_move_button(e);
}


function mouse_click_in_menu(e)
{
  if (e.offsetX < 1070 && e.offsetX > 1010
  && e.offsetY > 10 && e.offsetY < 70)
  {
    type_table = "settings";
    load_settings();
  }
}


function mouse_click_in_settings_theme(e)
{
  for (let i = 0; i < cards_theme.length; i++)
    if (e.offsetX < cards_theme[i].x + cards_theme[i].width && e.offsetX > cards_theme[i].x
    && e.offsetY > cards_theme[i].y && e.offsetY < cards_theme[i].y + cards_theme[i].height)
    {
      color.card = cards_theme[i].color_card;
      color.shadow = cards_theme[i].color_shadow;
      color.background = cards_theme[i].color_background;
      color.text = cards_theme[i].color_text;
      type_table = "menu";
      console.log('color ', color)
      load_menu();
      break;
    }
}


function mouse_click_in_game(e)
{
  if (e.offsetX < 1070 && e.offsetX > 1010
  && e.offsetY > 10 && e.offsetY < 70)
  {
    type_table = "pause";
    load_pause();
  }
  if (timer - time > 0.5)
    if (type_table != "game_with_bot" || player_and_bot.move == "player")
      for (var i = 0; i < 30; i++)
        if(check_move_card(e, i) && cards[i].active == 1)
        {
          open_card(i);
          break;
        }
}


function mouse_click_in_pause(e)
{
  for (var i = 0; i < button.length; i++)
  if ( type_table == button[i].type)

    if (e.offsetX < button[i].x + button[i].width && e.offsetX > button[i].x
    && e.offsetY > button[i].y && e.offsetY < button[i].y + button[i].height)
    {
      if (button[i].next == "rules_third_mode")
      {
        if (input.length < 2)
        {
          context.fillStyle = color.background;
          context.fillRect(input[0].x, input[0].y+90, 400, 35);
          context.fillStyle = color.text;
          context.font = "15pt Regular";
          context.fillText("Минимум 2 игрока", input[0].x, input[0].y+90+25);
          break;
        }
        var len = input.length-1;
        if (input[len].text == "")
        {
          context.fillStyle = color.background;
          context.fillRect(input[len].x, input[len].y+90, 400, 35);
          context.fillStyle = color.text;
          context.font = "15pt Regular";
          context.fillText("Введите имя содержащее буквы или цифры", input[len].x, input[len].y+90+25);
          break;
        }
        var flag_name = false;
        if (len >= 1)
          for (var y = 0; y < len; y++)
            if (input[len].text == input[y].text)
            {
                flag_name = true;
                break;
            }
        if (flag_name)
        {
          context.fillStyle = color.background;
          context.fillRect(input[len].x, input[len].y+90, 400, 35);
          context.fillStyle = color.text;
          context.font = "15pt Regular";
          context.fillText("Введите имя отличающееся от других", input[len].x, input[len].y+90+25);
          break;
        }
        removeEventListener("keyup", processKey1);
      }
      type_table = button[i].next;
      button[i].hover = false;
      if (type_table == "menu")
      {
        load_menu();
        break;
      }
      else if (type_table == "settings_theme")
      {
        load_settings_theme();
        break;
      }
      else if (type_table == "settings_sound")
      {
        load_settings_sound();
        break;
      }
      else if (type_table == "select_mode")
      {

        load_select_mode();
        break;
      }
      else if (type_table == "players_settings")
      {

        load_players_settings();
        break;
      }
      else if (type_table.indexOf("rules") != -1)
      {
        load_rules();
        break;
      }
      else if (type_table.indexOf("game") != -1 )
      {
        for (var j = 0; j < button.length; j++)
          if (button[j].type == "pause" && button[j].next != "menu")
          {
            button[j].next = type_table;
          }
        context.clearRect(0, 0, canvas.width, canvas.height);
        load_table();
        if (button[i].type != "pause")
        {
          timer = -0.01;
          time = -2;
          game = 0;
          player_and_bot = {player: 0, bot: 0, move: "player"};
          make_cards();
          console.log(input.length);
        }
        else if (button[i].type == "pause" && type_table.indexOf("game") != -1 && cards_active.first >= 0 && cards_active.second >= 0)
          setTimeout(update, 500);
        load_cards();
        break;
      }
  }
}



//клик мыши
function mouse_click(e)
{
  if (type_table == "menu")
    mouse_click_in_menu(e);
  if (type_table == "settings_theme")
    mouse_click_in_settings_theme(e);
  if (type_table.indexOf("game") != -1)
    mouse_click_in_game(e);
  if (type_table.indexOf("game") == -1)
    mouse_click_in_pause(e);
}

//ссоздание canvas и взаимодействие мышью с ним
function qw()
{
  canvas=document.getElementById("canvas")
  context=canvas.getContext("2d");
  setTimeout(load_menu, 100);

  //window.onmousedown = mouse;
  window.onkeydown = processKey;



  //поднимаем выбранную карту и
  //опускаем предыдущую по наведению мыши
  canvas.addEventListener("mousemove", mouse_move);


  //переворачиваем карту по клику
  canvas.addEventListener("click", mouse_click);
}




//заливаем форму карты
function zalivka_card(x, y, width, height, color)
{
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 0;
  context.beginPath();
  context.rect(x, y, cardWidth + width, cardHeight + height);
  context.fillStyle = color;
  context.fill();
  context.strokeStyle = color;
  context.lineJoin = "round";
  context.lineWidth = 7; // толщина рамок
  context.stroke(); // нарисовать рамку
  context.closePath();
}


//проверяем наведение мыши на неактивную карту
function check_move_card(e, i)
{
  return ((cards_active.count == 1 && cards_active.first != i || cards_active.count == 0)
  && timer > 0 && e.offsetX < (cards[i].x + cardWidth+4) && e.offsetX > cards[i].x
  && e.offsetY > cards[i].y && e.offsetY < (cards[i].y + cardHeight)
  && cards[i].status != 0);
}


//открываем карту
function open_card(i)
{
  if (move_bot.length == 5)
    move_bot.splice(0,1);
  move_bot.push(i);
  up_card(i);
  cards_active.count++;
  cards[i].click_status = 1;
  if (cards_active.count == 1)
    cards_active.first = i;
  else
  {
    cards_active.second = i;
    time = timer;
  }

  context.fillStyle = color.text;
  context.font = "25pt Regular";
  context.fillText(cards[i].number, cards[i].x + 5, cards[i].y + 40);

  if (cards_active.count == 2)
  {
    setTimeout(update, 500);
    cards_active.count = 0;
  }
}


//опускаем карту
function down_card(i)
{
  cards_active.active--;
  cards[i].active = 0;
  zalivka_card(cards[i].x-11, cards[i].y-11, 2, 2, color.background);
  zalivka_card(cards[i].x-1, cards[i].y-1, 2, 2, color.background);

  if (cards[i].status == 1)
  zalivka_card(cards[i].x, cards[i].y, 0, 0, color.card);
}


//поднятие карты
function up_card(i)
{
    if(cards[i].active == 0 && cards_active.active < 2)
    {
      cards[i].active = 1;
      cards_active.active++;
      zalivka_card(cards[i].x-1, cards[i].y-1, 2, 2, color.background);

      zalivka_card(cards[i].x, cards[i].y, 0, 0, color.shadow);
      zalivka_card(cards[i].x-10, cards[i].y-10, 0, 0, color.card);

      cards_active.pred = i;
    }
}


//проверяем предыдущую карту и опускаем
function down_pred_card()
{
  if (cards_active.active > 0 && cards_active.first != cards_active.pred
  && cards_active.second != cards_active.pred && cards_active.pred != -1)
    down_card(cards_active.pred);
}


//обновление статусов карт и завершения игры
function update()
{
  if (type_table != "pause" )
  {
    if (cards[cards_active.first].number == cards[cards_active.second].number)
    {
      game++;
      if (type_table == "game_with_bot" || (type_table == "pause" && button[0].next == "game_with_bot"))
        if (player_and_bot.move == "bot")
          player_and_bot.bot +=1;
        else
          player_and_bot.player +=1;

      if (type_table == "game_with_friends")
        input[move].point++;

      console.log("win");
      cards[cards_active.first].status = 0;
      cards[cards_active.second].status = 0;
    }
    else if (type_table.indexOf("game") != -1)
    {
      zalivka_card(cards[cards_active.first].x, cards[cards_active.first].y, 0, 0, color.card);
      zalivka_card(cards[cards_active.second].x, cards[cards_active.second].y, 0, 0, color.card);
    }

    down_card(cards_active.first);
    down_card(cards_active.second);

    if (type_table == "game_with_friends")
      if (move < input.length - 1)
        move++;
      else
        move = 0;
    if (type_table == "game_with_bot" || (type_table == "pause" && button[0].next == "game_with_bot"))
      player_and_bot.move = (player_and_bot.move == "player") ? "bot" : "player";

    competion_move();
    completion_game();

    if (type_table != "pause" && player_and_bot.move == "bot" && game < 15)
      m_bot();
  }
}

function m_bot()
{
  var flag = false;

  for (var first = 0; first < move_bot.length; first++)
  {
    var first_card = move_bot[first];
    flag = open_same_cards(first, first_card);
    if (flag)
    {
      open_card(first_card);
      break;
    }
  }
  if (!flag)
  {
    choose_card();
    flag = open_same_cards(move_bot.length - 1, move_bot[move_bot.length - 1]);
    if (!flag)
      choose_card();
  }
}

function choose_card()
{
  var fl = false;

  var f = Math.floor(Math.random() * 30);
  var count_repit = 0;
  while ((cards[f].status != 1 || cards[f].click_status != 0 || move_bot.indexOf(f) != -1) && count_repit < 30)
  {
    f = (f<29) ? f+1 : 0;
    count_repit++;
  }
  if (count_repit < 30)
    open_card(f);
}


function  open_same_cards(first, first_card)
{
  for (var second = 0; second < move_bot.length; second++)
  {
      if (first == second || move_bot[first] == move_bot[second])
        continue;

      var second_card = move_bot[second];
      if (cards[first_card].number == cards[second_card].number
      && cards[first_card].status == 1 && cards[second_card].status == 1)
      {
        open_card(second_card);
        return true;
      }
  }
  return false;
}


//завершение хода
function competion_move()
{
  cards[cards_active.first].active = 0;
  cards[cards_active.second].active = 0;

  //cards_active.active-=2;

  cards[cards_active.first].click_status = 0;
  cards[cards_active.second].click_status = 0;

  cards_active.first = -2;
  cards_active.second = -2;
  cards_active.pred = -1;
}


//завершение игры
function completion_game()
{
  if (game == 15)
  {
    if (type_table == "time_game")
    {
      type_table = "results_first_mode";
      context.rect(0, 0, 1080, 720);
      context.fillStyle = color.background;
      context.fill();
      context.font = "25pt Regular";
      context.fillStyle = color.text;
      context.fillText("Ваш результат: " + timer.toFixed(2), 400, 250);
      context.font = "10pt Regular";
      context.fillText("Чтобы начать нажми пробел!", 450, 650);
      for (var i = 0; i < button.length; i++)
        if (button[i].type == type_table)
          make_button(i, false);
    }
    else if (type_table == "game_with_bot")
    {
      type_table = "results_second_mode";
      context.rect(0, 0, 1080, 720);
      context.fillStyle = color.background;
      context.fill();
      context.font = "25pt Regular";
      context.fillStyle = color.text;
      if (player_and_bot.bot > player_and_bot.player)
        context.fillText("Выиграл бот", 450, 150);
      else if (player_and_bot.bot < player_and_bot.player)
        context.fillText("Ты выиграл", 450, 150);


      context.fillText("Кол-во очков игрока: " + player_and_bot.player, 400, 250);
      context.fillText("Кол-во очков бота: " + player_and_bot.bot, 400, 300);
      context.font = "10pt Regular";
      context.fillText("Чтобы начать нажми пробел!", 450, 650);
      game = 0;
      player_and_bot.player = 0;
      player_and_bot.bot = 0;
      player_and_bot.move = "player";
      for (var i = 0; i < button.length; i++)
        if (button[i].type == type_table)
          make_button(i, false);
    }
    else if (type_table == "game_with_friends")
    {
      type_table = "results_third_mode";
      context.rect(0, 0, 1080, 720);
      context.fillStyle = color.background;
      context.fill();
      context.font = "25pt Regular";
      context.fillStyle = color.text;
      var max = 0;
      var index = 0;
      for (var i = 0; i < input.length; i++)
      {
        context.fillText("Кол-во очков " + input[i].text + ": " + input[i].point, 400, 250 + i*50);
        if (input[i].point > max)
        {
          max = input[i].point;
          index = i;
        }
        input[i].point = 0;
      }
      context.fillText(input[index].text + "выиграл!", 450, 150);

      context.font = "10pt Regular";
      context.fillText("Чтобы начать нажми пробел!", 450, 650);
      move = 0;

      for (var i = 0; i < button.length; i++)
        if (button[i].type == type_table)
          make_button(i, false);
    }
  }
}

//взаимодействие с клавиатурой
function processKey(e)
{

  //1
  if (e.keyCode == 49 && type_table == "menu")
  {
    if (color.background == '#95A792')
    {
      img.src = 'images/button_blue.png'
      color.background = '#CADEFC';
      color.shadow = '#C3BEF0';
      color.card = '#DEFCF9';
      color.text = '#64467D';
    }
    else
    {
      img.src = 'images/button_green.png'
      color.background =  '#95A792';
      color.shadow = '#596C68';
      color.card = '#E3D9CA';
      color.text =  '#403F48';
    }
    setTimeout(load_menu, 100);
  }

  //space
  if (e.keyCode == 32 && (type_table == "menu" || type_table == "menu1"))
  {
    timer = -0.01;
    time = -2;
    game = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);
    type_table = "time_game";
    load_table();
    make_cards();
    load_cards();
  }

  if (type_table.indexOf("game") != -1 && player_and_bot.move == "player")
  {
    //enter
    if (e.keyCode == 13)
    {
        for (var i = 0; i < 30; i++)
          if((cards_active.count == 1 && cards_active.first != i || cards_active.count == 0)
          && timer > 0 && cards[i].click_status == 0 && cards[i].active == 1)
          {
            open_card(i)
            break;
          }
    }

    //вверх
    if (e.keyCode == 38)
    {
      //опускаем предыдущую карту если она не открыта
      down_pred_card();

      if (cards_active.pred < 0)
        cards_active.pred = 0;


      //берем следующую карту
      var i = (Math.floor(cards_active.pred / 10) - 1) * 10 + cards_active.pred % 10;


      //если карты сверху нет, берем карту снизу
      if (Math.floor(cards_active.pred / 10) <= 0)
        i = 20 + cards_active.pred % 10 ;

      //console.log(cards_active.pred, '->', i);
      var k = 0;
      while (cards[i].active == 1 || cards[i].status == 0)
      {
        //если актвная карта единственная в данном ряду остаемся на ней
        if (k == 2 && cards[i].active == 1)
          break;

        if (cards[i].status == 0)
          k++;
        else
          k = 0;

        if (Math.floor(i / 10) < 1)
          i = 20 + i % 10;
        else
          i = i = (Math.floor(i / 10) - 1) * 10 + i % 10;

        if (cards_active.first >= 0 && cards_active.second >= 0)
          if (k == 1 && cards[cards_active.first].number == cards[cards_active.second].number
          && Math.floor(cards_active.first / 10) == Math.floor(cards_active.second / 10))
          {
            i = 20 + (i % 10) + 1;
            k = 0;
          }

        //переходим на следующий ряд, если текущий пуст
        if (k == 3)
        {
          i = 20 + (i % 10) + 1;
          k = 0;
        }

        if (i == 30)
          break;
      }

      //console.log('клавиша-up');
      up_card(i);
    }

    //вниз
    if (e.keyCode == 40)
    {
      //опускаем предыдущую карту если она не открыта
      down_pred_card();

      if (cards_active.pred < 0)
        cards_active.pred = 20;

      //берем следующую карту
      var i = (Math.floor(cards_active.pred / 10) + 1) * 10 + cards_active.pred % 10;


      //если карты справа нет, берем карту с левого края
      if (Math.floor(cards_active.pred / 10) >= 2)
        i = cards_active.pred % 10;

      //console.log(cards_active.pred, '->', i);
      var k = 0;
      while (cards[i].active == 1 || cards[i].status == 0)
      {
        //если актвная карта единственная в данном ряду остаемся на ней
        if (k == 2 && cards[i].active == 1)
          break;

        if (cards[i].status == 0)
          k++;
        else
          k = 0;

        if (Math.floor(i / 10) >= 2)
          i = i % 10;
        else
          i = (Math.floor(i / 10) + 1) * 10 + i % 10;

        if (cards_active.first >= 0 && cards_active.second >= 0)
          if (k == 1 && cards[cards_active.first].number == cards[cards_active.second].number
          && Math.floor(cards_active.first / 10) == Math.floor(cards_active.second / 10))
          {
            i = i % 10 + 1;
            k = 0;
          }

        //переходим на следующий ряд, если текущий пуст
        if (k == 3)
        {
          i = i % 10 + 1;
          k = 0;
        }

        if (i == 30)
          break;
      }

      //console.log('клавиша-up');
      up_card(i);
    }

    //направо
    if (e.keyCode == 39)
    {
      //опускаем предыдущую карту если она не открыта
      down_pred_card();

        //берем следующую карту
        var i = cards_active.pred + 1;

        //если карты справа нет, берем карту с левого края
        if (cards_active.pred % 10 == 9)
          i = Math.floor(cards_active.pred / 10) * 10;

        var k = 0;

        //пока карта активна или уже найдена продолжаем поиск нужной
        while (cards[i].active == 1 || cards[i].status == 0)
        {
          //если актвная карта единственная в данном ряду остаемся на ней
          if (k == 9 && cards[i].active == 1)
            break;

          if (cards[i].status == 0)
            k++;
          else
            k = 0;

          if (i % 10 != 9)
            i++;
          else
            i = Math.floor(i / 10) * 10;

          if (cards_active.first >= 0 && cards_active.second >= 0)
            if (k == 8 && cards[cards_active.first].number == cards[cards_active.second].number
            && Math.floor(cards_active.first / 10) == Math.floor(cards_active.second / 10))
            {
              i = (Math.floor(i / 10) + 1) * 10;
              k = 0;
            }

          //переходим на следующий ряд, если текущий пуст
          if (k == 10)
          {
            i = (Math.floor(i / 10) + 1) * 10;
            k = 0;
          }

          if (i == 30)
            break;
        }
        //console.log('клавиша-up');
        up_card(i);
      }


    //налево
    if (e.keyCode == 37)
    {
      //опускаем предыдущую карту если она не открыта
      down_pred_card();

      if (cards_active.pred < 0)
        cards_active.pred = 0;
      var i = cards_active.pred - 1;
      if (cards_active.pred % 10 == 0)
        i = (Math.floor(cards_active.pred / 10) + 1) * 10 - 1;


      var k = 0;

      //пока карта активна или уже найдена продолжаем поиск нужной
      while (cards[i].active == 1 || cards[i].status == 0)
      {
        //если актвная карта единственная в данном ряду остаемся на ней
        if (k == 9 && cards[i].active == 1)
          break;

        if (cards[i].status == 0)
          k++;
        else
          k = 0;

        if (i % 10 != 0)
          i--;
        else
          i = Math.floor(i / 10) * 10 + 9;

        if (cards_active.first >= 0 && cards_active.second >= 0)
          if (k == 8 && cards[cards_active.first].number == cards[cards_active.second].number
          && Math.floor(cards_active.first / 10) == Math.floor(cards_active.second / 10))
          {
            i = (Math.floor(i / 10) + 1) * 10 + 9;
            k = 0;
          }

        //переходим на следующий ряд, если текущий пуст
        if (k == 10)
        {
          i = (Math.floor(i / 10) + 1) * 10 + 9;
          k = 0;
        }

        if (i == 39)
          break;
      }

        up_card(i);
      }
    }
}

//отрисовка промежуточных результатов игры
function draw()
{
  if (type_table.indexOf("game") != -1)
  {
    timer += 0.01;
    if (type_table == "time_game")
    {
      context.clearRect(950, 640, 150, 50);
      context.fillStyle = color.background;
      context.fillRect(950, 640, 150, 50);
      context.font = "25pt Regular";
      context.fillStyle = color.text;
      context.fillText(timer.toFixed(2), 960, 670);
    }
    else if (type_table == "game_with_bot")
    {
        context.clearRect(10, 10, 150, 50);
        context.fillStyle = "white";//color.background;
        context.fillRect(10, 10, 150, 50);
        context.font = "15pt Regular";
        context.fillStyle = color.text;
        context.fillText("Игрок: " + player_and_bot.player, 20, 50);

        context.clearRect(10, 70, 150, 50);
        context.fillStyle = "white";//color.background;
        context.fillRect(10, 70, 150, 50);
        context.font = "15pt Regular";
        context.fillStyle = color.text;
        context.fillText("Бот: " + player_and_bot.bot, 20, 110);
    }
    else if ( type_table == "game_with_friends")
    {
      context.clearRect(250, 120, 580, 50);
      context.fillStyle = color.background;
      context.fillRect(250, 120, 580, 50);
      context.font = "30pt Regular";
      context.fillStyle = color.text;
      var margin = (canvas.offsetWidth - context.measureText("Ходит " + input[move].text).width) / 2;
      context.fillText("Ходит " + input[move].text, margin, 150);

      for(var i = 0; i < input.length; i++)
      {
        context.clearRect(10, 10+i*45, 260, 35);
        context.fillStyle = color.background;
        context.fillRect(10, 10+i*45, 260, 35);
        context.font = "15pt Regular";
        context.fillStyle = color.text;
        context.fillText(input[i].text + ": " + input[i].point, 20, (i+1)*45 - 10);
      }
    }
  }

}


setInterval(draw, 10);

//отображение раздела "Меню"
function load_menu()
{
  context.fillStyle = color.background;
  context.fillRect(0,0, 1080, 720);
  context.font = "130px Regular";
  context.shadowBlur = 5;
  context.shadowOffsetX = 3;
  context.shadowOffsetY = 4;
  context.shadowColor = "rgba(0, 0, 0, 0.5)";
  context.fillStyle = "black";
  context.fillText("MEMORY", 250, 275);
  context.fillRect(250, 225, 575, 12);
  context.shadowBlur = 0;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;

  var img = new Image();

  img.onload = function()
  {
     context.drawImage(img, 1010, 10, 60, 60);
  };
  img.src = "images/settings.png";


  for (var i = 0; i < button.length; i++)
    if (button[i].type == "menu")
      make_button(i, false);
}


//отображение раздела "Выбор режима"
function load_select_mode()
{
  context.rect(0,0, 1080, 720);
  context.fillStyle = color.background;
  context.fill();
  context.fillStyle = color.text;
  context.font = "75pt Regular";
  context.fillText("Выбор режима", 225, 150);

  for (var i = 0; i < button.length; i++)
    if (button[i].type == "select_mode")
      make_button(i, false);
}


//отображение раздела "Настройки звука"
function load_settings_sound()
{
  context.rect(0,0, 1080, 720);
  context.fillStyle = color.background;
  context.fill();
  context.fillStyle = color.text;
  context.font = "75pt Regular";
  context.fillText("Settings sound", 225, 150);

  for (var i = 0; i < button.length; i++)
    if (button[i].type == "settings_sound")
      make_button(i, false);
}


//отображерие раздела "Настройки темы"
function load_settings_theme()
{
  context.clearRect(0, 0, 1080, 720);
  context.fillStyle = '#95A792';
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, 720);
  context.lineTo(200, 720);
  context.lineTo(450, 0);
  context.closePath();
  context.fill();

  context.fillStyle = '#CADEFC';
  context.beginPath();
  context.moveTo(200, 720);
  context.lineTo(450, 0);
  context.lineTo(650, 0);
  context.lineTo(880, 720);
  context.closePath();
  context.fill();

  context.fillStyle = '#EAAFAF';
  context.beginPath();
  context.moveTo(1080, 0);
  context.lineTo(1080, 720);
  context.lineTo(880, 720);
  context.lineTo(650, 0);
  context.closePath();
  context.fill();

  for (var i = 0; i < cards_theme.length; i++)
    make_cards_theme(i, false);
}

function make_cards_theme(number, shadow)
{
  context.fillStyle = cards_theme[number].color_background;
  context.fillRect(cards_theme[number].x-20, cards_theme[number].y-20, cards_theme[number].width+40, cards_theme[number].height+40);

  if (shadow)
  {
    context.shadowOffsetX = 10;
    context.shadowOffsetY = 10;
    context.shadowColor = cards_theme[number].color_shadow;
    context.shadowBlur = 4;
  }
  context.fillStyle = cards_theme[number].color_card;

   context.fillRect(cards_theme[number].x, cards_theme[number].y, cards_theme[number].width, cards_theme[number].height);
   context.shadowOffsetX = 0;
   context.shadowOffsetY = 0;
   context.shadowColor = "#000000";
   context.shadowBlur = 0;
}

function mouse_move_cards_theme(e)
{
  for (var i = 0; i < cards_theme.length; i++)
  {
      if (!cards_theme[i].hover && e.offsetX < cards_theme[i].x + cards_theme[i].width && e.offsetX > cards_theme[i].x
      && e.offsetY > cards_theme[i].y && e.offsetY < cards_theme[i].y + cards_theme[i].height)
      {
        make_cards_theme(i, true); //make_cards_theme(i, true);
        cards_theme[i].hover = true;
      }
      else if (cards_theme[i].hover && ((e.offsetX > cards_theme[i].x + cards_theme[i].width || e.offsetX < cards_theme[i].x)
      || (e.offsetY < cards_theme[i].y || e.offsetY > cards_theme[i].y + cards_theme[i].height)))
      {
        make_cards_theme(i, false); //make_cards_theme(i, false);
        cards_theme[i].hover = false;
      }
  }
}


//отображение раздела "Настройки"
function load_settings()
{
  context.rect(0,0, 1080, 720);
  context.fillStyle = color.background;
  context.fill();

  context.fillStyle = color.text;
  context.font = "75pt Regular";
  context.fillText("Settings", 375, 150);

  for (var i = 0; i < button.length; i++)
    if (button[i].type == "settings")
      make_button(i, false);
}


//отображение раздела "Пауза"
function load_players_settings()
{
  context.rect(0,0, 1080, 720);
  context.fillStyle = color.background;
  context.fill();

  context.fillStyle = color.text;
  context.font = "45pt Regular";
  context.fillText("Введите никнеймы", 300, 100);

  if (input.length != 0)
    input.splice(0, input.length);
  c_input++;
  input.push(new Input_1());
  input[0].active = true;
  input[0].text = "";
  input[0].point = 0;
  input[0].x = 130;
  input[0].y = 130;

  context.beginPath();
  context.rect(input[0].x, input[0].y, 450, 70);
  context.fillStyle = color.card;
  context.fill();
  context.strokeStyle = color.card;
  context.lineJoin = "round";
  context.lineWidth = 10; // толщина рамок
  context.stroke(); // нарисовать рамку
  context.closePath();

  addEventListener("keyup", processKey1);


  var img = new Image();
 img.onload = function()
 {
   context.drawImage(img, input[0].x + 470, input[0].y+15, 40, 40);
 };
 img.src = "images/+.png";

addEventListener("click", e => {
  if (type_table == "players_settings")
  {
    var len = input.length - 1;
    if (len > 0 && e.offsetX < input[len].x + 512 + 40 && e.offsetX > input[len].x + 512
    && e.offsetY > input[len].y+30-15 && e.offsetY <  input[len].y + 30 + 10+15)
    {
      context.fillStyle = color.background;
      context.fillRect(input[len].x-10,input[len].y-10, 600, 160);

      input.pop();
      len = input.length - 1;
      input[len].active = true;
      var img = new Image();
      img.onload = function()
      {
        context.drawImage(img, input[len].x + 470, input[len].y+15, 40, 40);
      };
      img.src = "images/+.png";
      c_input--;
      if (len > 0)
      {
        var img_minus = new Image();
        img_minus.onload = function()
        {
          context.drawImage(img_minus, input[len].x + 512, input[len].y+30, 40, 10);
        };
        img_minus.src = "images/-.png";
      }
    }

    if (len < 3 && e.offsetX < input[len].x + 470 + 50 && e.offsetX > input[len].x + 470
    && e.offsetY > input[len].y+15 && e.offsetY <  input[len].y + 15 +40)
      if (input[len].text != "")
      {

        var flag_name = false;
        if (len >= 1)
          for (var y = 0; y < len; y++)
            if (input[len].text == input[y].text)
            {
                flag_name = true;
                break;
            }
        if (!flag_name)
        {
         input.push(new Input_1());
         c_input++;
         len = input.length - 1;
         input[len].active = true;
         input[len-1].active = false;
         input[len].text = "";
         input[len].point = 0;
         input[len].x = 130;
         input[len].y = input[len-1].y + 90;

         context.fillStyle = color.background;
         context.fillRect(input[len-1].x + 470,input[len-1].y+15, 40, 40);
         if (len < 3)
         {

           var img = new Image();
           img.onload = function()
           {
             context.drawImage(img, input[len].x + 470, input[len].y+15, 40, 40);
           };
           img.src = "images/+.png";
         }
         context.fillStyle = color.background;
         context.fillRect(input[len-1].x + 512,input[len-1].y+30, 40, 10);
         var img_minus = new Image();
         img_minus.onload = function()
         {
           context.drawImage(img_minus, input[len].x + 512, input[len].y+30, 40, 10);
         };
         img_minus.src = "images/-.png";

         context.beginPath();
         context.rect(input[len].x, input[len].y, 450, 70);
         context.fillStyle = color.card;
         context.fill();
         context.strokeStyle = color.card;
         context.lineJoin = "round";
         context.lineWidth = 10; // толщина рамок
         context.stroke(); // нарисовать рамку
         context.closePath();
       }
       else
       {
         context.fillStyle = color.background;
         context.fillRect(input[len].x, input[len].y+90, 400, 35);
         context.fillStyle = color.text;
         context.font = "15pt Regular";
         context.fillText("Введите имя отличающееся от других", input[len].x, input[len].y+90+25);
       }
     }
     else
     {
       context.fillStyle = color.background;
       context.fillRect(input[len].x, input[len].y+90, 400, 35);
       context.fillStyle = color.text;
       context.font = "15pt Regular";
       context.fillText("Введите имя содержащее буквы или цифры", input[len].x, input[len].y+90+25);
      }
  }
});
  for (var i = 0; i < button.length; i++)
    if (button[i].type == "players_settings")
      make_button(i, false);
}

function processKey1(e)
{
  if (type_table == "players_settings")
    for (var t = 0; t < input.length; t++)
    if (input[t].active)
    {
      context.beginPath();
      context.rect(input[t].x, input[t].y, 450, 70);
      context.fillStyle = color.card;
      context.fill();
      context.strokeStyle = color.card;
      context.lineJoin = "round";
      context.lineWidth = 10; // толщина рамок
      context.stroke(); // нарисовать рамку
      context.closePath();
      if (e.key == "Backspace")
        input[t].text = input[t].text.substring(0, input[t].text.length - 1);
      else if (/^[0-9a-zа-яё]$/i.test(e.key) && input[t].text.length < 10)
        input[t].text += e.key;


      context.fillStyle = color.text;
      context.font = "25pt Regular";
      context.fillText(input[t].text, input[t].x + 20, input[t].y+45);
    }
}


function load_rules()
{
  context.rect(0,0, 1080, 720);
  context.fillStyle = color.background;
  context.fill();
  var xhr = new XMLHttpRequest();
  var file =  'rules/' + type_table.slice(6) + '.json';
  xhr.open('GET', file);

  xhr.responseType = 'json';
  xhr.send();

  var json;
  var text = [];
  xhr.onload = function() {
    json = xhr.response;
    text = json["text_array"];
    for (var y = 0; y < text.length; y++)
    {
      context.fillStyle = color.text;
      context.font = "13pt Regular";
      var margin = (canvas.offsetWidth - context.measureText(text[y]).width) / 2;
      console.log(margin)
      context.fillText(text[y], margin, 200+y*30);
    }
  }

  for (var i = 0; i < button.length; i++)
    if (button[i].type == type_table)
      make_button(i, false);
}


//отображение карт на столе
function load_cards()
{
  for (var q = 0; q < 30; q++)
    if (cards[q].status == 1)
      if (cards[q].active == 1)
      {
        zalivka_card(cards[q].x, cards[q].y, 0, 0, color.shadow);
        zalivka_card(cards[q].x-10, cards[q].y-10, 0, 0, color.card);

        if (cards[q].click_status == 1)
        {
          context.fillStyle = color.text;
          context.font = "25pt Regular";
          context.fillText(cards[q].number, cards[q].x + 5, cards[q].y + 40);
        }
      }
      else
        zalivka_card(cards[q].x, cards[q].y, 0, 0, color.card);
}


//отображение раздела "Пауза"
function load_pause()
{
  context.rect(0,0, 1080, 720);
  context.fillStyle = color.background;
  context.fill();

  context.fillStyle = color.text;
  context.font = "125pt Regular";
  context.fillText("Пауза", 325, 300);

  for (var i = 0; i < button.length; i++)
    if (button[i].type == "pause")
      make_button(i, false);
}

//отрисовка кнопки
function make_button(number, shadow)
{
  if (color.background == '#95A792')
    img.src = 'images/button_green.png'
  else if (color.background == '#CADEFC')
    img.src = 'images/button_blue.png'
  else
    img.src = 'images/button_purple.png'

  context.fillStyle = color.background;
  context.fillRect(button[number].x-20, button[number].y-20, button[number].width+40, button[number].height+40);
  if (shadow)
  {
    context.shadowOffsetX = 10;
    context.shadowOffsetY = 10;
    context.shadowColor = color.shadow;
    context.shadowBlur = 4;
  }
  context.fillStyle = color.shadow;
  context.drawImage(img, button[number].x, button[number].y, button[number].width, button[number].height);
  context.fillStyle = color.text;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowColor = "#000000";
  context.shadowBlur = 0;
  context.font = "55px Regular";
  var margin = (button[number].width - context.measureText(button[number].text).width) / 2;
  context.fillText(button[number].text, button[number].x + margin, button[number].y+65);
}


//отображение игрового стола
function load_table()
{
  context.fillStyle = color.background;
  context.fillRect(0,0, 1080, 720);

  var img = new Image();

 img.onload = function()
 {
   context.drawImage(img, 1010, 10, 60, 60);
 };
 img.src = "images/pause.png";
}

//создание карт
function make_cards()
{
  for (var q = 0; q < 30; q++)
  {
    cards[q] = {x: 0, y: 0, number: Math.floor((q+2)/2), status: 1, active: 0, click_status: 0};
    cards[q].y = 200 + Math.floor(q / 10) * 125;
    cards[q].x = q % 10 * 100 + 50;
  }

  for (var f = 0; f < 30; f++)
  {
    var g = cards[f].number;
    var j = Math.floor(Math.random() * 30);

    cards[f].number = cards[j].number;
    cards[j].number = g;
  }
}
