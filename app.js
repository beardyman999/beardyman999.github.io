let user;
let app = new PIXI.Application({backgroundColor: 0xf1f3f6, width:850, height:650, antialias: true,  });
document.body.appendChild(app.view);
var Init = new Initer;
let socket = io.connect("wss://ultimmate.ru:4793", {secure: true});
let lvl = 1;
//roulete param
var inform;
var randomNum;
var countStep = 1;
// draw() param
const avamasc = new PIXI.Graphics();
const graphics = new PIXI.Graphics();


const basicText = new PIXI.Text();
			basicText.x = 340;
			basicText.y = 610;
			/*basicText.x = canvas.width / 2;
			basicText.y = 610;*/
			basicText.style = textStyle();

const info = new PIXI.Text();
			info.x = 10;
			info.y = 90;
			//info.style = textStyle();
const orderWindow = new PIXI.Graphics()
									.lineStyle(2, 0xFF00FF, 1)
									.beginFill(0xffffff)
									.drawRoundedRect(100, 100, 650, 400, 9)
			 						.endFill()
			 						.interactive = true	// Opt-in to interactivity
			 						.buttonMode = true;	// Shows hand cursor
// create a new background sprite
const background = PIXI.Sprite.from('preloader.jpg');
			background.width = app.screen.width;
			background.height = app.screen.height;
			child(background);

basicText.text = 'Загрузка скриптов';
function textStyle(){
		 let style =  new PIXI.TextStyle({
			 fontFamily: 'Arial',
			 fontSize: 15,
			 align: 'right',
			 fontWeight: 'bold',
			 fill: ['#fca62e', '#fca62e'], // gradient
		 });
	return style;
}
const basicBalanceBlock = new PIXI.Graphics();
		basicBalanceBlock.lineStyle(2, 0xFF00FF, 1)
					.beginFill(0xffffff)
					.drawRoundedRect(70, 39, 60, 20, 9)
			 		.endFill()
					.interactive = true	// Opt-in to interactivity
			 		.buttonMode = true;	// Shows hand cursor

  const balanceText = new PIXI.Text();
  balanceText.x = 77;
  balanceText.y = 40;
  balanceText.style =textStyle();
	balanceText.text = '0';

basicText.text = 'Соединяемся с сервером...';

socket.on('eventClient', function (data) {
		//console.log(data);
		info.text = data.data;
});

	/*
	socket.on('rouleteResult', function (data) {
		console.log(data);
		info.text += '\n'+data.message;
	});*/
function userInfo(data) {
	  const basicTextBlock = new PIXI.Graphics();
	  basicTextBlock.lineStyle(2, 0xFF00FF, 1)
					.beginFill(0xffffff)
					.drawRoundedRect(70, 10, 140, 20, 9)
				 	.endFill()
	  child(basicTextBlock);

	  const basicText = new PIXI.Text(data, textStyle());
	  basicText.x = 77;
	  basicText.y = 10;
	  child(basicText);
}

socket.on('connect', function () {
	VK.init(function() {
		basicText.text = 'Загрузка данных VK API...';
		VK.api('users.get', {fields: 'photo_50'}, function (data) {
		 		user = data.response[0];
				userInfo(user.first_name +' '+ lvl+' уровень' , connect()); //'+ user.last_name +'

		});
},'5.103');
	function connect() {
		socket.on('eventClientBalance', function (data) {
			balanceText.text = data.coin;
		});
		socket.emit('eventServer', { data: user }, draw()); //draw();
	};

	VK.addCallback('onOrderSuccess', function(order_id) {
		socket.emit('onOrderSuccess', {message: 'onOrderSuccess', first_name: user.first_name, last_name: user.last_name, order_id:order_id, id:user.id});
		socket.on('eventClientBalance', function (data) {
			balanceText.text = data.coin;
		});
	});
});

function gameStart() {
// load spine data
	app.loader
    .add('spineboypro', 'spineboy-pro.json')
    .load(onAssetsLoaded);
		app.stage.interactive = true;

	function onAssetsLoaded(loader, res) {
    // create a spine boy
    const spineBoyPro = new PIXI.spine.Spine(res.spineboypro.spineData);
    // set the position
    spineBoyPro.x = 160;
    spineBoyPro.y = app.screen.height;
    spineBoyPro.scale.set(0.3);
    child(spineBoyPro);

    const singleAnimations = ['aim', 'death', 'jump', 'portal'];
    const loopAnimations = ['hoverboard', 'idle', 'run', 'shoot', 'walk'];
    const allAnimations = [].concat(singleAnimations, loopAnimations);

    let lastAnimation = '';
    // Press the screen to play a random animation
    let animation = '';
    do {//animation = allAnimations[Math.floor(Math.random() * allAnimations.length)];
			animation = loopAnimations[0];
    } while (animation === lastAnimation);

    spineBoyPro.state.setAnimation(0, animation, loopAnimations.includes(animation));
    lastAnimation = animation;
    app.stage.on('pointerdown', () => {});
	}
}

function draw(){
	background.anchor.set(1);

	basicText.text = '';

	graphics.lineStyle(2, 0xFF00FF, 1);
	graphics.beginFill(0xf1f3f6);
	graphics.drawRect(-1, -1, 852, 71);
	graphics.endFill();
  child(graphics);
	// draw a rounded rectangle
	avamasc.lineStyle(2, 0xFF00FF, 1);
	avamasc.beginFill(0x650A5A, 0.25);
	avamasc.drawRoundedRect(10, 10, 50, 50, 9);
	avamasc.endFill();
	child(avamasc);

	const ava = PIXI.Sprite.from(user.photo_50);
	ava.x = 10;
	ava.y = 10;
	basicBalanceBlock.interactive = true;	// Opt-in to interactivity
	basicBalanceBlock.buttonMode = true;	// Shows hand cursor
	basicBalanceBlock.on('click', order);// Pointers normalize touch and mouse
  ava.mask = avamasc;

	  child(info);
		child(ava);
		child(basicBalanceBlock);
		child(balanceText);
		gameStart();
}
function child(data) {app.stage.addChild(data);}

function roulete (){
		/*
		var result = Math.abs(randomNum - answer.value);

		if( result == 0 ){
			inform = 'Поздравляем! Вы угадали число!';
			answer.style.display = 'none';
			document.getElementById('send').style.display = 'none';
		}else if( result < 10 ){
			inform = 'Очень тепло! (ошиблись в диапазоне от 1 до 10)';
		}else if( result < 100 ){
			inform = 'Тепло! (ошиблись в диапазоне от 10 до 100)';
		}else if( result < 1000 ){
			inform = 'Холодно! (ошиблись в диапазоне от 100 до 1000)';
		}else{
			inform = 'Очень холодно! (ошиблись на 1000 и более)';
		}

		//document.getElementById('info').innerHTML += '<p>#' + countStep + ' Вы ответили: ' + answer.value + ' - ' + info + '</p>';
		answer.value = '';
		countStep++;*/
}

function orderWin() {
    child(orderWindow);
	//orderWindow.on('click', orderWinClose);
	//basicBalanceBlock.on('click', order);
	//orderWindow.on('tap', orde);
}
function orderWinClose() {
  app.stage.removeChild(orderWindow);
}
function order() {
  VK.callMethod('showOrderBox', {type: 'item',item: 'item10', v: '5.73'})
}
function sub() {
  VK.callMethod('showSubscriptionBox', 'create', {type: 'subscription_25new',item: 'sub1'});
}

VK.addCallback('onOrderFail', function() {
	socket.send(JSON.stringify({message: 'onOrderFail'}));
});
VK.addCallback('onOrderCancel', function() {
	socket.send(JSON.stringify({message: 'onOrderCancel'}));
});
// SUBSCRIBE
VK.addCallback('onSubscriptionSuccess', function(subscription_id) {
	socket.emit('onSubscriptionSuccess', {message: 'onSubscriptionSuccess', order_id: subscription_id });
	console.log(subscription_id);
});
VK.addCallback('onSubscriptionFail', function() {
	socket.send(JSON.stringify({message: 'onSubscriptionFail'}));
});
VK.addCallback('onSubscriptionCancel', function() {
    socket.send(JSON.stringify({message: 'onSubscriptionCancel'}));
});

socket.on('disconnect', function () {
/*app.stage.removeChild(armatureDisplay);
app.stage.removeChild(avamasc);
app.stage.removeChild(graphics);
app.stage.removeChild(info);
background.anchor.set(0);*/
basicText.text = 'Восстанавливаем связь...';
});
child(basicText);
