let keyb = {};
keyb.down = false;
keyb.right= false;
keyb.up   = false;
keyb.left = false;
keyb.space= false;
document.onkeydown = function(e)
{
	if(e.keyCode == 40)keyb.down = true;
	if(e.keyCode == 39)keyb.right= true;
	if(e.keyCode == 38)keyb.up 	 = true;
	if(e.keyCode == 37)keyb.left = true;
	if(e.keyCode == 32)keyb.space= true;
	if(e.keyCode == 13)keyb.ent = true;
}
document.onkeyup = function(e)
{
	if(e.keyCode == 40)keyb.down = false;
	if(e.keyCode == 39)keyb.right= false;
	if(e.keyCode == 38)keyb.up 	 = false;
	if(e.keyCode == 37)keyb.left = false;
	if(e.keyCode == 32)keyb.space= false;
	if(e.keyCode == 13)keyb.ent = false;
}

let mainflag = false;
let count = 0;
cocks = [];


// 乱数を得る自作関数
const rand = function(min, max)
{
	return Math.floor(Math.random()*(max-min+1))+min;
};
// sin
function getSin(degree)
{
	let rad = degree * (Math.PI/180);
	return Math.sin(rad);
}
// cos
function getCos(degree)
{
	let rad = degree * (Math.PI/180);
	return Math.cos(rad);
}


// キャンバスを初期化。コンテキストを得るオブジェクト(コンストラクタ)
let Con = 
	{
		// とりあえずnullでキャンバスとコンテキストを初期化。
		can: null,
		con: null,
		create: function(canvas_tag_id)
		{
			this.can = document.getElementById(canvas_tag_id);
			this.con = this.can.getContext("2d");
			this.can.width = window.innerWidth; 
			this.can.height = window.innerWidth*(9/16); 
			return this.con;
		}
	};

Con.create("can");

let cock = function(pop_x, pop_y, image_src)
{
	/* コンストラクタ */
		// 出現位置の座標
		this.px = pop_x;
		this.py = pop_y;
		// 画像のソースをnullで初期化。
		this.img = null;
		this.RAD = Math.PI/180;
		this.angle = rand(0, 360);
		this.flag = 0;


	/* ファイル読み込みの判定 */
	if(image_src != undefined && image_src != "" && image_src != null)
	{
		this.img = new Image();
		this.img.src = image_src;
	}
	else
	{
		console.log("image_srcを読み込めませんでした");
		return;
	}

		this.maxW = window.innerWidth+(this.img.width/16);
		this.minW = -(this.img.width/16);
		this.maxH = window.innerWidth*(9/16)+(this.img.height/16);
		this.minH = -(this.img.height/16);
		this.maximgW =window.innerWidth+(this.img.width/16);
		this.minimgW =-(this.img.width/16);
		this.maximgH =window.innerWidth*(9/16);
		this.minimgH =-(this.img.width/16);

	/* オブジェクトを描画 */
	this.draw = function()
	{
		Con.con.drawImage(this.img, this.px, this.py, this.img.width, this.img.height);
	};
	this.rotate = function()
	{
		// 回転前の画面を保存
		Con.con.save();
		// キャンバス全体の位置をずらす
		Con.con.translate(this.px, this.py)
		// キャンバスを回転
		Con.con.rotate(this.angle*this.RAD);
		// 描画(src, 回転の中心座標(translate(x,y))に画像の中心を合わせる)
		// 画像の幅・高さの半分をマイナス方向にずらせば良い。/16しているのは元の画像を/8しているので更にそれの半分。
		Con.con.drawImage(this.img,-(this.img.width/4), -(this.img.height/4), this.img.width/2, this.img.height/2);
		// 復元
		Con.con.restore();

	};

	/* オブジェクトを更新 */
	this.update = function()
	{
		if(count%10 == 0) this.flag = rand(-1,1);
		if(this.angle > 360)this.angle=0;
		else if(this.angle < 0)this.angle=360;
		
		/*
		if(keyb.left)this.angle-=4;
		if(keyb.right)this.angle+=4;
		*/

		if(this.flag == 1)this.angle-=4;
		else if( this.flag == 0) this.angle+=0; 
		else if( this.flag == -1) this.angle+=4; 
		//if(count%8==0)this.angle+=rand(0, 5);
		
		//if()this.angle+=4;
		// スペースが押されたら
		//if(keyb.space)
		if(count)
		{
			// x座標左端が画像ファイルよりも大きく、右端が画面端よりも小さいとき
			if(this.px>= this.minW && this.px<= this.maxW )
			{
				
				this.px += (getCos(90-this.angle)*10);
				// pxが画像ファイルの半分よりも小さい時。
				if(this.px<= this.minimgW )this.px=this.maximgW;
				if(this.px> this.maximgW )this.px= this.minimgW;
			}
			// y座標の指定範囲内で、
			if(this.py>= this.minH && this.py<= this.maxH )
			{
				this.py -= (getSin(90-this.angle)*10);
				if(this.py<= this.minimgH )this.py = this.maximgH;
				else if(this.py > this.maximgH )this.py = this.minimgH;
			}
			//console.log("xの増加量 = "+(getCos(this.angle)*10));
			//console.log("yの増加量 = "+(getSin(this.angle)*10));
		}
	};

	/* デバッグ情報をテキスト表示 */
	this.debug = function()
	{
		Con.con.fillStyle ="#000";
		Con.con.fillText("x = "+this.px, 20, 20);
		Con.con.fillText("y = "+this.py, 20, 40);
		Con.con.fillText("canvas_w = "+window.innerWidth, 500, 20);
		Con.con.fillText("canvas_h = "+window.innerWidth*(9/16), 500, 40);
	};
};


// メニューの何番目かをカウントするための変数。スイッチで分岐
let menu = 0;
let keyupflag = true;
let keydownflag = true;
// テキストの表示位置のズレを格納する変数
let posi = 0;

function titleUpdate()
{
	if(keyb.down == true &&  keydownflag == true)
	{
		keydownflag = false;
		menu++;
	}
	else if(keyb.down == false)
	{
		keydownflag = true;
	}
	if(keyb.up == true && keyupflag == true)
	{
		keyupflag = false;
		menu--;
	}
	else if(keyb.up == false)
	{
		keyupflag = true;
	}
	if(menu>2)menu=0;
	if(menu<0)menu=2;

	if(menu == 0 )
	{
		if(keyb.ent == true)mainflag = true;
	}
}
function titleDraw()
{
	// 背景を描画
	Con.con.fillStyle ="black";
	Con.con.fillRect(0, 0, window.innerWidth, window.innerWidth*(9/16));

	cocks[0].rotate();
	cocks[0].update();
	cocks[1].rotate();
	cocks[1].update();
	count++;
	// タイトルを描画
	Con.con.shadowColor ="rgba(255, 255, 255, 0.3";
	Con.con.shadowOffsetX = 2;
	Con.con.shadowOffsetY = 1;
	Con.con.font = "48px 'IMPACT'";
	Con.con.fillStyle ="white";
	let title = "COCKROACHES DIE HARD";
	let titleWidth = Con.con.measureText(title).width;
	Con.con.fillText(title, ((window.innerWidth-titleWidth)/2), (window.innerHeight/4)+rand(0,3));
	Con.con.storkeStyle ="black";
	Con.con.strokeText(title, (window.innerWidth-titleWidth)/2, (window.innerHeight/4));

	// 選択肢を描画
	Con.con.font = "36px 'IMPACT'";
	let newgame = "NEW GAME";
	let load = "CONTINUE";
	let option = "OPTION";
	let newWidth = Con.con.measureText(newgame).width;
	let optionWidth = Con.con.measureText(option).width;
	let loadWidth = Con.con.measureText(load).width;

	switch(menu)
	{
		case 0:
			posi = rand(0,3);
			Con.con.fillStyle="rgba(255, 255, 255, 1)";
			Con.con.fillText(newgame, (window.innerWidth-newWidth)/2, (window.innerHeight/2)+posi);
			Con.con.fillStyle="rgba(255, 255, 255, 0.4)";
			Con.con.fillText(load, (window.innerWidth-loadWidth)/2, (window.innerHeight/2)+50);
			Con.con.fillText(option, (window.innerWidth-optionWidth)/2, (window.innerHeight/2)+100);
			Con.con.strokeText(newgame, (window.innerWidth-newWidth)/2, (window.innerHeight/2));
			Con.con.strokeText(load, (window.innerWidth-loadWidth)/2, (window.innerHeight/2)+50);
			Con.con.strokeText(option, (window.innerWidth-optionWidth)/2, (window.innerHeight/2)+100);
			break;
		case 1:
			posi = rand(0,3);
			Con.con.fillStyle="rgba(255, 255, 255, 0.4)";
			Con.con.fillText(newgame, (window.innerWidth-newWidth)/2, (window.innerHeight/2));
			Con.con.fillStyle="rgba(255, 255, 255, 1)";
			Con.con.fillText(load, (window.innerWidth-loadWidth)/2, (window.innerHeight/2)+50+posi);
			Con.con.fillStyle="rgba(255, 255, 255, 0.4)";
			Con.con.fillText(option, (window.innerWidth-optionWidth)/2, (window.innerHeight/2)+100);
			Con.con.strokeText(newgame, (window.innerWidth-newWidth)/2, (window.innerHeight/2));
			Con.con.strokeText(load, (window.innerWidth-loadWidth)/2, (window.innerHeight/2)+50);
			Con.con.strokeText(option, (window.innerWidth-optionWidth)/2, (window.innerHeight/2)+100);
			break;
		case 2:
			posi = rand(0,3);
			Con.con.fillStyle="rgba(255, 255, 255, 0.4)";
			Con.con.fillText(newgame, (window.innerWidth-newWidth)/2, (window.innerHeight/2));
			Con.con.fillText(load, (window.innerWidth-loadWidth)/2, (window.innerHeight/2)+50);
			Con.con.fillStyle="rgba(255, 255, 255, 1)";
			Con.con.fillText(option, (window.innerWidth-optionWidth)/2, (window.innerHeight/2)+100+posi);
			Con.con.strokeText(newgame, (window.innerWidth-newWidth)/2, (window.innerHeight/2));
			Con.con.strokeText(load, (window.innerWidth-loadWidth)/2, (window.innerHeight/2)+50);
			Con.con.strokeText(option, (window.innerWidth-optionWidth)/2, (window.innerHeight/2)+100);
			break;
		default:
			break;
	}
}
function title()
{
	titleUpdate();
	titleDraw();
}


function draw()
{
	Con.con.clearRect(0, 0, Con.can.width, Con.can.height);
	Con.con.fillStyle ="black";
	Con.con.fillRect(0, 0, window.innerWidth, window.innerWidth*(9/16));
	for(let i=0; i<cocks.length; i++)
	{
		cocks[i].rotate();
//		cocks[i].debug();
	}
}
function update()
{
	for(let i=0; i<cocks.length; i++)
	{
		cocks[i].update();
	}
	//console.log(cock1.angle);
	count++;
}
/*
function mainLoop()
{
	draw();
	update();
}
*/

for(let i=0; i<50; i++)
{
	cocks[i] = new cock(rand(0,window.innerWidth),rand(0, window.innerWidth*(9/16)), "goki.png");
}

window.onload = function mainLoop()
{
	requestAnimationFrame(mainLoop);
	if(!mainflag)
	{
		title();
	}
	else
	{
		update();
		draw();
	}
};
