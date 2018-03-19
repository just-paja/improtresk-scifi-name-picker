const TIME_BS_MESSAGE = 1300;
const TIME_GENERATOR = 10000;
// const TIME_BS_MESSAGE = 200;
// const TIME_GENERATOR = 2000;

const bullshitMessages = [
  [
    'Skenuji lokální subprostorové kontinuum',
    'Měřím úroveň tachyonové radiace',
    'Aktualizuji hvězdnou mapu',
  ],
  [
    'Startuji virtuální neurální sítě',
  ],
  [
    'Připojuji auxiliární entropické generátory',
  ],
  [
    'Připravuji transdimensionální determinant',
    'Měřím neutrinový spin',
  ],
  [
    'Vytvářím warpovou bublinu',
  ],
  [
    'Eliminuji poprostorový šum',
    'Resetuji bussard kolektory',
  ],
  [
    'Pročítám Facebook',
    'Permutuji pořadí kandidátů',
    'Definuji vzorec náhodnosti podle počasí',
  ],
  [
    'Konzultuji se Stephenem Hawkingem',
    'Sestavuji chaotickou indukční sekvenci',
  ],
  [
    'Házím kostkou',
  ],
];

const findLongestName = names => names.reduce((maxLength, name) => {
  if (!maxLength || name.length > maxLength) {
    return name.length;
  }
  return maxLength;
}, 0);

const letters = 'AÁBCČDĎEÉĚFGHIÍJKLMNŇOÓPQRŘSŠTŤUÚŮVWXYÝZŽ'.split('');

const generateRandomInt = maxSize => Math.floor(Math.random() * Math.floor(maxSize));

const generateRandomLetter = () => letters[generateRandomInt(letters.length)];

const renderPlaceholder = (parent, next) => {
  const placeholder = $('<div class="anim-entry name-char-placeholder" />');
  parent.append(placeholder);
  placeholder.shuffling = false;
  placeholder.shuffle = () => {
    placeholder.shuffling = true;
    placeholder.randomizeContent();
  };
  placeholder.setLetter = (letter) => {
    placeholder.html(letter);
    placeholder.addClass('name-char-placeholder-updated');
    setTimeout(() => {
      placeholder.removeClass('name-char-placeholder-updated');
    }, 100);
  };
  placeholder.randomizeContent = () => {
    placeholder.resetTimeout = setTimeout(() => {
      if (placeholder.shuffling) {
        placeholder.setLetter(generateRandomLetter());
        placeholder.randomizeContent();
      }
    }, 20 * generateRandomInt(60));
  };
  placeholder.stop = () => {
    placeholder.shuffling = false;
    clearTimeout(placeholder.resetTimeout);
  };
  placeholder.displayLetter = (letter, displayLetterNext) => {
    const tasks = [];
    const max = generateRandomInt(4);
    for (let i = 0; i < max; i += 1) {
      tasks.push(taskNext => setTimeout(() => {
        placeholder.setLetter(generateRandomLetter());
        taskNext();
      }, 20 * generateRandomInt(40)));
    }
    tasks.push(taskNext => setTimeout(() => {
      placeholder.setLetter(letter);
      if (letter) {
        if (letter.replace(/ /g, '').length === 0) {
          placeholder.addClass('hidden-element');
        }
        taskNext();
      } else {
        hideElement(placeholder, taskNext);
      }
    }, 20 * generateRandomInt(40)));
    async.series(tasks, displayLetterNext);
  };
  setTimeout(() => {
    next(null, placeholder);
  }, 150);
};

const renderPlaceholders = (parent, size, next) => {
  const tasks = [];
  for (let i = 0; i < size; i++) {
    tasks.push(placeholderNext => renderPlaceholder(parent, placeholderNext));
  }
  async.series(tasks, next);
};

const renderNameDisplay = (root, names, next) => {
  const nameDisplay = $('<div class="flex-center name-picker" />');
  const longestName = findLongestName(names);
  nameDisplay.css({ width: `${longestName * 2 + 2}rem` })
  root.append(nameDisplay);
  nameDisplay.shuffle = () => {
    nameDisplay.placeholders.forEach(placeholder => placeholder.shuffle());
  };
  nameDisplay.shuffleStop = () => {
    nameDisplay.placeholders.forEach(placeholder => placeholder.stop());
  };
  nameDisplay.displayName = (name, displayNext) => {
    const nameLetters = name.toUpperCase().split('');
    const tasks = nameDisplay.placeholders.map((placeholder, index) => letterDisplayNext =>
      placeholder.displayLetter(nameLetters[index], letterDisplayNext)
    );
    async.parallel(tasks, displayNext);
  };
  renderPlaceholders(nameDisplay, longestName, (err, placeholders) => {
    nameDisplay.placeholders = placeholders;
    next(null, nameDisplay);
  });
}

const generateName = (nameDisplay, names, next) => {
  const winner = names[generateRandomInt(names.length)];
  nameDisplay.shuffleStop();
  nameDisplay.displayName(winner, next);
};

const renderNameBackground = (root, next) => {
  const item = $('<div class="anim-scale-entry info-background name-background" />');
  root.append(item);
  setTimeout(next, 300);
};

const renderHudItemContent = (item, label, values) => {
  const itemLabel = $('<div class="anim-entry hud-item-label" />');
  itemLabel.html(label);
  item.append(itemLabel);

  values.forEach(value => {
    const itemValue = $('<div class="anim-entry hud-item-value" />');
    itemValue.html(value);
    item.append(itemValue);
  });
};

const renderHudItem = (hud, label, values, next) => {
  const item = $('<div class="flex-center anim-width-entry hud-item hud-item-loading" />');
  setTimeout(() => {
    item.removeClass('hud-item-loading');
    renderHudItemContent(item, label,values);
  }, 1500);
  hud.append(item);
  next();
};

const renderHud = (position) => {
  const item = $('<div class="hud" />');
  item.addClass(`hud-${position}`);
  return item;
};

const renderHudBackground = (root, next) => {
  const item = $('<div class="anim-scale-entry info-background hud-background" />');
  root.append(item);
  setTimeout(next, 300);
};

const renderBottomHudBackground = (root, next) => {
  const item = $('<div class="anim-scale-entry info-background hud-background hud-background-bottom" />');
  root.append(item);
  setTimeout(next, 300);
};

const renderStartButton = () => {
  const button = $('<button class="name-picker-start" />');
  button.html('Spustit');
  return button;
};

const renderBullshitMessage = (message) => {
  const item = $('<div class="bs-message" />');
  item.html(message);
  return item;
};

const playBullshitMessage = (messenger, message, speed, next) => {
  const item = renderBullshitMessage(message);
  messenger.append(item);
  setTimeout(next, speed);
};

const playBullshitMessages = (messenger, messages, speed, next) => {
  const tasks = messages.map((message) => (callback) =>
    playBullshitMessage(messenger, message, speed, callback)
  );
  async.series(tasks, next);
};

const renderMessenger = () => $('<div class="bs-messages" />');

const hideElement = (element, next) => {
  element.addClass('hidden-element');
  setTimeout(() => {
    element.remove();
    next();
  }, 250);
};

const renderPicker = (names) => {
  const body = $('body');
  const bgWrapper = $('#bgWrapper');
  const root = $('#picker');
  const heading = $('<div id="heading"><h1>Improtřesk 2018 zdarma</h1></div>');
  const hudBottom = renderHud('bottom');
  const hudTop = renderHud('top');
  const messenger = renderMessenger();
  const startButton = renderStartButton();

  let nameDisplay;

  const play = () => {
    async.series([
      next => hideElement(startButton, next),
      next => renderHudBackground(body, next),
      next => renderBottomHudBackground(body, next),
      next => renderHudItem(hudTop, 'Neurální sítě', [
        '3548',
      ], next),
      next => playBullshitMessages(messenger, bullshitMessages[0], TIME_BS_MESSAGE, next),
      next => renderHudItem(hudTop, 'Datum', [
        moment().format('D. M.'),
        moment().format('Y'),
      ], next),
      next => playBullshitMessages(messenger, bullshitMessages[1], TIME_BS_MESSAGE, next),
      next => renderHudItem(hudTop, 'Aux. Generátory', [
        '68642',
      ], next),
      next => playBullshitMessages(messenger, bullshitMessages[2], TIME_BS_MESSAGE, next),
      next => renderHudItem(hudBottom, 'Grav. konstanta', [
        '<small>6.67408×10<sup>-11</sup></small>',
        '<small>m<sup>3</sup> kg<sup>-1</sup> s<sup>-2</sup></small>',
      ], next),
      next => playBullshitMessages(messenger, bullshitMessages[3], TIME_BS_MESSAGE, next),
      next => renderHudItem(hudBottom, 'Grav. zrychlení', [
        '9,823',
        'm·s<sup>-2</sup>',
      ], next),
      next => playBullshitMessages(messenger, bullshitMessages[4], TIME_BS_MESSAGE, next),
      next => renderHudItem(hudBottom, 'Rovníková rychlost', [
        '465,1',
        '<small>m·s<sup>-1</sup></small>',
      ], next),
      next => playBullshitMessages(messenger, bullshitMessages[5], TIME_BS_MESSAGE, next),
      next => renderHudItem(hudTop, 'Počet jmen', [names.length], next),
      next => playBullshitMessages(messenger, bullshitMessages[6], TIME_BS_MESSAGE, next),
      next => renderHudItem(hudBottom, 'Atmosférický tlak', ['1013,25', '<small>hPa</small>'], next),
      next => playBullshitMessages(messenger, bullshitMessages[7], TIME_BS_MESSAGE, next),
      next => renderHudItem(hudBottom, 'Délka sekvence', ['746', '<small>members</small>'], next),
      next => playBullshitMessages(messenger, bullshitMessages[8], TIME_BS_MESSAGE, next),
      next => hideElement(messenger, next),
      next => renderNameBackground(bgWrapper, next),
      next => renderNameDisplay(root, names, (err, nameDisplayComponent) => {
        nameDisplay = nameDisplayComponent;
        nameDisplay.shuffle();
        next();
      }),
      next => setTimeout(next, TIME_GENERATOR),
      next => generateName(nameDisplay, names, next),
    ], () => {
      body.addClass('done');
      console.log('done');
    });
  };

  root.append(heading);
  root.append(hudBottom);
  root.append(hudTop);
  root.append(messenger);
  root.append(startButton);

  startButton.click(play);
};
