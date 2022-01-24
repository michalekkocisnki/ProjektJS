kaboom({
  width: 800,
  height: 600,
  font: "sink",
  canvas: document.querySelector("#mycanvas"),
  background: [ 0, 0, 0, ],
  scale: 1
})

const MOVE_SPEED = 120;
const SLICER_SPEED = 100;
const SKELETOR_SPEED = 60;

const BOSS_SPEED = 60;
const PROJECTILE_SPEED = 60;
const BOSS_INITIAL_HP = 150;
const PLAYER_INIT_DMG = 30;

const PLAYER_LIVES = 1;

// hosting grafik
loadRoot('https://i.imgur.com/')
loadSprite('link-going-left', '1Xq9biB.png')
loadSprite('link-going-right', 'yZIb8O2.png')
loadSprite('link-going-down', 'tVtlP6y.png')
loadSprite('link-going-up', 'UkV0we0.png')
loadSprite('left-wall', 'rfDoaa1.png')
loadSprite('top-wall', 'QA257Bj.png')
loadSprite('bottom-wall', 'vWJWmvb.png')
loadSprite('right-wall', 'SmHhgUn.png')
loadSprite('bottom-left-wall', 'awnTfNC.png')
loadSprite('bottom-right-wall', '84oyTFy.png')
loadSprite('top-left-wall', 'xlpUxIm.png')
loadSprite('top-right-wall', 'z0OmBd1.jpg')
loadSprite('top-door', 'U9nre4n.png')
loadSprite('fire-pot', 'I7xSp7w.png')
loadSprite('left-door', 'okdJNls.png')
loadSprite('lanterns', 'wiSiY09.png')
loadSprite('slicer0', 'c6JFi5Z.png')
loadSprite('skeletor', 'Ei1VnX8.png')
loadSprite('kaboom', 'o9WizfI.png')
loadSprite('stairs', 'VghkL08.png')
loadSprite('bg', 'u4DVsx6.png')
loadSprite('death', 'Bnj0CeJ.png')
loadSprite('death2', 'KG7vmqS.png')
loadSprite('warrior', 'ad1CotQ.png')
loadSprite('devil', 'XP7rz1k.png')
loadSprite('heart', 'nLRvHJW.png')
loadSprite('youwin', 'bM471yw.jpg')
loadSprite('boss', 'eGX2kqv.png')

loadSpriteAtlas("uCOkeKu.png", {
  "hero": {
    x: 0,
    y: 0,
    width: 480,
    height: 384,
    sliceX: 10,
    sliceY: 8,
    anims: {
      idle: { from: 0, to: 2, loop: true, speed: 4, pingpong: true },
      forward: { from: 60, to: 69, loop: true },
      backward: { from: 40, to: 49, loop: true },
      right: { from: 70, to: 79, loop: true },
      left: { from: 50, to: 59, loop: true }
    }
  }
})

loadSpriteAtlas("2VMXEYP.png", {
  "fire":
  {
    x: 0,
    y: 0,
    width: 96,
    height: 96,
    sliceX: 8,
    sliceY: 4,
    anims: {
      fire: { from: 0, to: 31, loop: true}
    }
  }
});



scene('game', ({ level, score, lives }) => {
  layers(['bg', 'obj', 'ui'], 'obj')

  const maps = [
    [
      'ycc)cccccc^w',
      'a          b',
      'a*       * b',
      'a      (   b',
      'a   8    8 b',
      'a      (   b',
      'a     *    b',
      'a   *      b',
      'a *        b',
      'a          b',
      'xdd)dd)ddddz',
    ],
    [
      'yccccccccccw',
      'a          b',
      ')   }    } )',
      'a          b',
      'a   }      b',
      'a      $   b',
      ')     }    )',
      'a          b',
      'a          b',
      'a          b',
      'xddddddddddz',
    ],
    [
      'yccccccccccw',
      ')          )',
      ')   *    * )',
      ')          )',
      ')   }      )',
      ')         *)',
      ')     }    )',
      ')     t    )',
      ')     *    )',
      ')         $)',
      'xddddddddddz',
    ],
    [
      'ycc)ccc)cccw',
      'a *        b',
      'a        8 b',
      'a          b',
      'a        B b',
      'a          b',
      'a          b',
      'a          b',
      'a          b',
      'a  8      *b',
      'xdd)dddd)ddz',
    ]
  ]
  
  const levelCfg = {
      width: 48,
      height: 48,
      pos: vec2(0, 0),
      "a": () => [sprite('left-wall'), area(), solid(), "wall"],
      "b": () => [sprite('right-wall'), area(), solid(), "wall"],
      "c": () => [sprite('top-wall'), area(), solid(), "wall", "wall-hor"],
      "d": () => [sprite('bottom-wall'), area(), solid(), "wall", "wall-hor"],
      "w": () => [sprite('top-right-wall'), area(), solid(), "wall"],
      "x": () => [sprite('bottom-left-wall'), area(), solid(), "wall"],
      "y": () => [sprite('top-left-wall'), area(), solid(), "wall"],
      "z": () => [sprite('bottom-right-wall'), area(), solid(), 'wall'],
      "%": () => [sprite('left-door'), area(), solid(), 'door'],
      "^": () => [sprite('top-door'), 'next-level', area()],
      "$": () => [sprite('stairs'), 'next-level', area()],
      "*": () => [sprite('slicer0'), 'slicer', 'dangerous', area(), solid(), rotate(0), origin('center'), { dir: -1, timer: 0.1 }],
      "8": () => [sprite('slicer0'), 'slicer-hor', 'dangerous', area(), solid(), rotate(0), origin('center'), { dir: -1, timer: 0.1 }],
      "}": () => [sprite('skeletor'), 'skeletor', 'dangerous', area(), solid(), { vec: vec2(0, 0), timer: -1 }],
      ")": () => [sprite('lanterns'), area(), solid(), 'lanterns'],
      "(": () => [sprite('fire-pot'), area(), solid(), 'fire-pot'],
      "t": () => [sprite('devil'), area(), solid(), 'devil', {timer: 0, shake: -1, step: 25}],
      "B": () => [sprite('boss'), area(), solid(), health(BOSS_INITIAL_HP), 'boss', 'dangerous', origin('center'), { dir: vec2(1, 1), eaten: 0, timer: time(), attackTimer: 3 }]
    }

  addLevel(maps[level], levelCfg)
  add([sprite('bg'), layer('bg'), pos(48, 48)]);


  add([text('Level: ' + parseInt(level + 1)), pos(600, 60), scale(2)])

  const player = add([
    sprite("hero"),
    pos(75, 190),
    {
      dir: vec2(1, 0),
      shots: 0,
      lives: lives,
      time: time(),
      damage: PLAYER_INIT_DMG
    },
    'player',
    origin('center'),
    area(),
    solid(),
    health(100)
  ]);

  player.play("idle");

  player.onUpdate(() => {
    let anim = player.curAnim();

    if(isKeyDown("left")) {
      if(anim !== 'left')
        player.play('left');

      player.move(-MOVE_SPEED, 0)
      player.dir = vec2(-1, 0)
    }
    else if(isKeyDown("up")) {
      if(anim !== 'forward')
        player.play('forward');
      
      player.move(0, -MOVE_SPEED)
      player.dir = vec2(0, -1)
    }
    else if(isKeyDown("right")) {
      if(anim !== 'right')
        player.play('right');
      
      player.move(MOVE_SPEED, 0)
      player.dir = vec2(1, 0)
    }
    else if(isKeyDown("down")) {
      if(anim !== 'backward')
        player.play('backward');

      player.move(0, MOVE_SPEED)
      player.dir = vec2(0, 1)
    }
    else {
      if(anim !== 'idle')
        player.play('idle');
    }
  });

  onClick("devil", d => {
    player.lives += 1;
    score++;
    destroy(d);
  })

  player.on("damage", () => {
    if(time() - player.time > 0.5) {
      player.lives--;
      player.time = time();
    }

    if(player.lives <= 0)
      go('lose', { score: score })
  })

  ui = add([
    layer("ui")
  ]);

  ui.on("draw", () => {

    drawText({
      text: "Score: " + score,
      font: "sink",
      scale: 2,
      pos: vec2(600, 30)
    });

    drawText({
      text: "Lives: ",
      font: "sink", 
      size: 16,
      pos: vec2(600, 0),
    });
    for (let i = 0; i < player.lives; i++) {
      drawSprite({
        sprite: "heart",
        pos: vec2(680 + i*30, 0),
        origin: "topleft",
        scale: 0.4
      });
    }

    let boss = get("boss")[0]
    if(boss) {
      drawRect({
        width: 100,
        height: 10,
        fill: false,
        pos: vec2(width()/2-150, 55),
        outline: { color: BLACK, width: 4 },
      });

      drawRect({
        width: 98 * (boss.hp()/BOSS_INITIAL_HP),
        height: 8,
        pos: vec2(width()/2-149, 56),
        color: RED,
      });

      drawText({
        text: "Boss: ",
        font: "sink",
        size: 16,
        color: color(0, 0, 0),
        pos: vec2(width()/2-215, 52),
      })
    }
  });

  onUpdate("slicer", s => {
    s.angle += 180 * dt();
    s.move(s.dir * SLICER_SPEED, 0)
  })

  onUpdate("slicer-hor", s => {
    s.angle += 180 * dt();
    s.move(0, s.dir * SLICER_SPEED);
  });

  onCollide('player', 'next-level', () => {
    let lvl = level+1;
    score += 5;

    if(lvl >= maps.length) {
      go("youwin", {score: score});
      return;
    }

    localStorage.level = (lvl) % maps.length;
    localStorage.score = score;

    go('game', {
      level: (level + 1) % maps.length,
      score: score,
      lives: player.lives
    })
  })

  const spawnKaboom = (p) => {

    if(player.shots >= 1)
      return;

    const obj = add([sprite('kaboom'), pos(p), 'kaboom', area(), rotate(0), origin('center')]);

    obj.on("destroy", () => {
      player.shots -= 1;
    });

    player.shots += 1;
    wait(1, () => {
      destroy(obj)
    })
  }

  onUpdate("kaboom", k => {
    k.angle += 360 * dt();
  })

  keyPress('space', () => {
    spawnKaboom(player.pos.add(player.dir.scale(48)))
  })

  onCollide('kaboom', 'skeletor', (k, s) => {
    shake(10);
    wait(1, () => destroy(k));
    destroy(s)
    score++;
  })

  onCollide('kaboom', 'boss', (k, b) => {
    wait(0.3, () => destroy(k));
    b.hurt(10);
  });

  on("death", "boss", b => {
    destroy(b);
    add([sprite('top-door'), 'next-level', area(), solid(), pos(center())]);

  });

  const slicer_collision = (s) => {
    if(s.timer <= 0) {
      s.timer = 0.1;
      s.dir = -s.dir;
    }

    s.timer -= dt();
  }

  const boss_collision = (b, s) => {
    b.eaten++;
    destroy(s);
    player.damage -= 5;

  }

  onCollide('slicer', 'wall', s => slicer_collision(s));
  onCollide('slicer-hor', 'wall', s => slicer_collision(s));
  onCollide('slicer', 'next-level', s => slicer_collision(s));
  onCollide('slicer', 'lanterns', (s) => slicer_collision(s));
  onCollide('slicer-hor', 'lanterns', (s) => slicer_collision(s));
  onCollide('slicer', 'fire-pot', (s) => slicer_collision(s));
  onCollide('slicer', 'slicer', (s1, s2) => {
    slicer_collision(s1);
    slicer_collision(s2);
  });

  onCollide('slicer-hor', 'slicer', (s1, s2) => {
    slicer_collision(s2)
    slicer_collision(s1)
  });

  onCollide('slicer', 'devil', s => slicer_collision(s));

  onCollide('boss', 'slicer-hor', (b, s) => boss_collision(b, s));
  onCollide('boss', 'slicer', (b, s) => boss_collision(b, s));

  onCollide('boss', 'wall-hor', b => {
    if((time() - b.timer) >= 0.5) {
      b.timer = time();
      b.dir = vec2(b.dir.x, b.dir.y*-1)
    }
  });

  onCollide('boss', 'wall', b => {
    if((time() - b.timer) >= 0.5) {
      b.timer = time();
      b.dir = vec2(b.dir.x * -1, b.dir.y);

      b.flipX(b.dir.x === -1 ? true : false);
    }
  });

  onCollide('boss', 'lanterns', b => {
    if(time() - b.timer >= 0.5) {
      b.timer = time();
      b.dir = vec2(b.dir.x * -1, b.dir.y * -1);
      b.flipX(b.dir.x === -1 ? true : false);
    }
  });

  onCollide('player', 'devil', (p, d) => {
    p.trigger("damage");
    score--;
    destroy(d);
  })

  onUpdate('boss', b => {
    b.move(b.dir.x * BOSS_SPEED, b.dir.y * BOSS_SPEED);

    b.attackTimer -= dt();
    if(b.attackTimer <= 0) {
      shake(100);

      let attacks = [
        add([sprite('fire'), scale(2), area(), pos(b.pos), origin('center'), 'projectile', 'dangerous', { dir: vec2(1, 0)}]),
        add([sprite('fire'), scale(2), area(), pos(b.pos), origin('center'), 'projectile', 'dangerous', { dir: vec2(-1, 0)}]),
        add([sprite('fire'), scale(2), area(), pos(b.pos), origin('center'), 'projectile', 'dangerous', { dir: vec2(0, 1)}]),
        add([sprite('fire'), scale(2), area(), pos(b.pos), origin('center'), 'projectile', 'dangerous', { dir: vec2(0, -1)}]),
      ];

      attacks.forEach(p => {
        p.play("fire");
      });

      b.attackTimer = rand(5) + 2;
    }
  })

  onUpdate("projectile", p => {
    p.move(rand(PROJECTILE_SPEED)+PROJECTILE_SPEED * p.dir.x, rand(PROJECTILE_SPEED)+PROJECTILE_SPEED * p.dir.y);
  });

  onCollide("projectile", "wall", p => destroy(p));

  onUpdate('skeletor', (s) => {
    let PlayerPos = player.pos;
    let EnemyPos = s.pos;
    let dirX = EnemyPos.x === PlayerPos.x ? 0 : (EnemyPos.x < PlayerPos.x ? 1 : -1);
    let dirY = EnemyPos.y === PlayerPos.y ? 0 : (EnemyPos.y < PlayerPos.y ? 1 : -1);
    s.vec = vec2(dirX, dirY);
	
    s.move(dirX * SKELETOR_SPEED, dirY * SKELETOR_SPEED)
  })

  onUpdate('devil', (d) => {
    d.move(d.shake * d.step, d.shake * d.step);

    d.timer -= dt()
    if (d.timer <= 0) {
      d.timer = rand(1);
      d.shake *= -1
    }
  })

  onCollide('skeletor', 'wall', (s) => {
    s.dir = -s.dir
  })
  
  onCollide('skeletor', 'skeletor', (s1, s2) => {
	  s2.vec = vec2(-1, -1);
  })

  onCollide('player', 'dangerous', () => {
    player.trigger("damage");
  })
})

// Lose
scene('lose', ({ score }) => {


  let highScore = localStorage.highScore || score;
  if (score >= highScore)
    localStorage.highScore = score;

  highScore = localStorage.highScore;

  add([rect(1920, 1080), color(0, 0, 0)])
  add([sprite('death2'), pos(width() / 2 - 200, 10)])
  add([text('Game Over'), scale(5), origin('center'), pos(width() / 2, height()/2 - 48), color(255, 0, 0)])
  add([text('Score: ' + score), scale(3), origin('center'), pos(width() / 2, height() / 2), color(50, 255, 0)])
  add([text('Highest Score: ' + highScore), scale(3), origin('center'), pos(width()/2, height()/2 + 48), color(0, 5, 240)])

  add([rect(160, 20), area(), pos(width()/2, height()/2+150), "button", { clickAction: () => go('menu') }, origin('center')])
  add([text("Go Back To Menu"), pos(width()/2, height()/2+150), origin('center'), color(0, 0, 0),])

  onHover("button", 
  b => { 
    b.use(color(0, 178, 178));
    cursor("pointer"); 
  }, 
  b => { 
      b.use(color(255, 255, 255));
      cursor("default"); 
    });

  onClick("button", b => b.clickAction());
})


// Menu
scene("menu", () => {
	
  add([
    sprite('warrior'),
    pos(width()/2, height()/2),
    origin('center'),
    scale(0.3)
  ])

	add([
		text("The Warrior"),
		pos(width()/2, height()/2 - 150),
		scale(3),
    origin('center')
	]);

	add([
		rect(160, 20),
    area(),
		pos(width()/2, height()/2),
		"button",
		{
			clickAction: () => go('game', { level: 0, score: 0, lives: PLAYER_LIVES }),
		},
    origin('center')
	]);

	add([
		text("New Game"),
		pos(width()/2, height()/2),
		color(0, 0, 0),
    origin('center')
	]);

	add([
		rect(160, 20),
    area(),
		pos(width()/2, height()/2 + 30),
		"button",
		{
			clickAction: () => {
        let lvl = parseInt(localStorage.level || 0);
        let score = parseInt(localStorage.score || 0);

        go('game', {level: lvl, score: score, lives: PLAYER_LIVES});
       },
		},
    origin('center')
	]);

	add([
		text("Continue"),
		pos(width()/2, height()/2 + 30),
		color(0, 0, 0),
    origin('center')
	]);

  add([
		rect(160, 20),
    area(),
		pos(width()/2, height()/2 + 60),
		"button",
		{
			clickAction: () => close(),
		},
    origin('center')
	]);

	add([
		text("Exit"),
		pos(width()/2, height()/2 + 60),
		color(0, 0, 0),
    origin('center')
	]);

  onHover("button", 
  b => { 
    b.use(color(0, 178, 178));
    cursor("pointer"); 
  }, 
  b => { 
      b.use(color(255, 255, 255));
      cursor("default"); 
    });

  onClick("button", b => b.clickAction());
});

// Win
scene("youwin", ({score}) => {
	
  add([text("You WIN"), pos(center()), origin('center'), scale(8), color(255, 180, 0)]);
  add([text("Score: " + score), pos(vec2(center()).add(0, 100)), origin('center'), scale(3), color(255, 200, 0)]);

});

go('menu');