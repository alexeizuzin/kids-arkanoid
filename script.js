
// Задаем начальные значения данных:

// Координата биты игрока (отступ слева)
bitaLeft = 220;

// Координаты мяча в ассоциативном массиве
shar = {top: 410, left: 220}

// Шаг изменения координат шарика
// при отрицательном значении координата уменьшается
pribavka = {top: -3, left: 3}

// Данные кирпичей
// массив (список) ассоциативных массивов (объектов) с координатами
// кроме координат, у каждого кирпича есть признак видимости
kirpichi = [
	{top: 20, left: 20, viden: true},
	{top: 20, left: 120, viden: true},
	{top: 20, left: 220, viden: true},
	{top: 20, left: 320, viden: true},
	{top: 20, left: 420, viden: true},
	{top: 50, left: 20, viden: true},
	{top: 50, left: 120, viden: true},
	{top: 50, left: 220, viden: true},
	{top: 50, left: 320, viden: true},
	{top: 50, left: 420, viden: true}
]

// номер последнего стукнутого кирпича
nomerStuknutogo = 0;

// Создаем переменную, в которой будет храниться периодический запуск функции движения шарика
dvijenie = null;

// Теперь создаем функции:

// стартовая функция
function startProgram(){
	// при нажатии кнопок клавиатуры, запускаем программу keyProgram
	window.onkeydown = keyProgram;
}

// функция реагирует на нажатия клавиатуры
// в эту функцию автоматически передаются данные о нажатии в переменную 'e'
function keyProgram(e){

	// влево
    if (e.keyCode == 37){
    	bitaLeft = bitaLeft - 35;
    	// ограничиваем движение биты слева
    	if (bitaLeft < 10){ bitaLeft = 10 }
    	// и теперь двигаем html-элемент биты
		document.getElementById('id_bita').style.left = bitaLeft;
    }

	// вправо
    if (e.keyCode == 39){
    	bitaLeft = bitaLeft + 35;
    	// если бита слишком уползла вправо, возвращаем в крайне-правую позицию
    	if (bitaLeft > 430){ bitaLeft = 430 }
    	// и теперь двигаем html-элемент биты
		document.getElementById('id_bita').style.left = bitaLeft;
    }

	// пробел
    if (e.keyCode == 32 || e.charCode == 32){
    	// запускаем движение мячика
    	startShar();
    }

    // выводим в консоли информацию о нажатии клавиш
    console.log(e)
}


function startShar(){
	// каждые 10 миллисекунд будет выполняться функция передвижения шарика на один шажок
	dvijenie = setInterval(moveShar, 10);
}

function stopShar(){
	// останавливаем регулярные выполнения функции moveShar
	clearInterval(dvijenie);
}


// функция сдвига шарика на один шажок
function moveShar(){

	// запоминаем новое значение координат
	shar.left = shar.left + pribavka.left;
	shar.top = shar.top + pribavka.top;

	// проверяем, свободна ли ячейка для движения шарика
	// и запоминаем в переменной 
	svobodnoLiMesto = proverkaMesta();
	// !== означает "не равно"
	if(svobodnoLiMesto !== 'svobodno'){
		// если место не свободно, надо изменить направление полета шарика
		// но куда?

		// возврат по горизонтали
		shar.left = shar.left - pribavka.left;

		// снова проверим 
		if (proverkaMesta() !== 'svobodno'){
			// если даже после отступа по горизонтали место занято
			// вспомним, какая у нас была преграда
			if(svobodnoLiMesto == 'kirpich'){
				// если перед мячиком кирпич
				// удаляем кирпич по номеру
				kirpichi[nomerStuknutogo]['viden'] = false;
				document.getElementById('id_kirpich_0' + nomerStuknutogo).style.display = 'none';
				// проверка есть ли еще кирпичи
				proverkaKirpichei()
			}
			// сделаем отскок по вертикали
			otskokVertikalno();
		} else {
			// если свободно
			if(svobodnoLiMesto == 'kirpich'){
				// если кирпич
				// удаляем его
				kirpichi[nomerStuknutogo]['viden'] = false;
				document.getElementById('id_kirpich_0' + nomerStuknutogo).style.display = 'none';
				// проверка есть ли еще кирпичи
				proverkaKirpichei()
			}
			//отскок по горизонтали
			otskokGorizontalno();
		}
		// возврат по вертикали
		shar.top = shar.top - pribavka.top;

	} else {
		// в ином случае место свободно:
		// меняем координаты у html-элемента на новые
		document.getElementById('id_shar').style.left = shar.left;
		document.getElementById('id_shar').style.top = shar.top;
	}
}

function otskokVertikalno(){
	// меняем шаг прибавки на противоположный
	pribavka.top = -pribavka.top;

	shar.left = shar.left + pribavka.left;
	shar.top = shar.top + pribavka.top;
}

function otskokGorizontalno(){
	// меняем шаг прибавки на противоположный
	pribavka.left = -pribavka.left;

	shar.left = shar.left + pribavka.left;
	shar.top = shar.top + pribavka.top;
}

// функция для проверки свободно ли место перед шариком
// возвращает (return) название преграды, если место занято
// или 'svobodno'

// важно: после срабатывания команды "return" функция сразу завершается
function proverkaMesta(){
	// проверим, не выходят ли координаты за рамки поля
	if(shar.left > 510){ return 'stena' }
	if(shar.left < 20){ return 'stena' }
	if(shar.top < 20){ return 'stena' }

	// если шарик в нижней части поля
	if(shar.top > 490){
		// проверим ударился ли он в биту
		if(shar.left > bitaLeft && shar.left < bitaLeft + 100){
			return 'bita'
		} else {
			// а если мимо биты - останавливаем игру
			stopShar();
			// и возвращаем координаты мячика в стартовую точку 
			shar = {top: 410, left: 220}
			return 'svobodno';
		}

		
	}

    // поочередно проверяем каждый кирпич
	for (x in kirpichi) {
		// но только видимые
		if(kirpichi[x]['viden'] == true){
			// если по вертикали шарик попадает в зону кирпича
			if(shar.top > kirpichi[x]['top'] && shar.top < kirpichi[x]['top'] + 30){
				// и по горизонтали тоже
				if(shar.left > kirpichi[x]['left'] && shar.left < kirpichi[x]['left'] + 100){
					// запоминаем стукнутый кирпич
					nomerStuknutogo = x;
					// функция возвратит признак удара по кирпичу
					return 'kirpich';
				}
			}
		}
	};	

	// если проверка пройдена и совпадений не найдено, значит место свободно
	return 'svobodno'
}	

function proverkaKirpichei(){
	for(x in kirpichi){
		if (kirpichi[x].viden == true) {
			// если хоть один кирпич видим
			// завершить функцию
			return;
		}
	}
	// если проверка не выявила видимых кирпичей
	// и функция не завершилась командой return, то получаеся что все кирпичи разбиты
	alert('Победа!');
}

// Запуск функции startProgram устанавливаем на момент после полной загрузки веб-страницы
window.onload = startProgram;
