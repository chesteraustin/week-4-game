$( document ).ready(function() {
	var attackerPosition;
	var defenderPosition;
	var winScore = 0;
	var loseScore = 0;
	var multiplier = 1;
	var gameThemeSelected = 'starWars'
	var characters =  initCharacters(gameThemeSelected);
	var remainingEnemies = characters.length - 1;
	outputStats(characters);

	//GAME MODE
	$(".gameMode").on("click", function(){
		var multiplier = parseInt($(this).val());
	})

	//GAME THEME
	$(".gameTheme").on("click", function(){
		var gameTheme = $(this).val();
		characters = initCharacters(gameTheme);
		outputStats(characters);
	})

	//SELECT ATTACKER
	$(".characterContainer").on("click", ".character", function(){
		var attacker = characters[$(this).attr("data-position")]
		attacker.selected = true;
		attackerPosition = [$(this).attr("data-position")];
		moveCharacters(characters);
		$("#gameMessage").text("Choose a defender!");
	})

	//SELECT DEFENDER
	$(".characterContainer").on("click", ".pending", function(){
		//Clear message
		$("#gameMessage").text("Attack!");
		//reset status of characters to FALSE / pending
		for (var i = 0; i < characters.length; i++){
			if (characters[i].selected == "defender") {
				characters[i].selected = false;
			}
		}
		//put selected character in DEFENSE
		var defender = characters[$(this).attr("data-position")]
		defender.selected = "defender";
		defenderPosition = [$(this).attr("data-position")];
		moveDefender(characters);

		//once defender has been selected, show attack button
		console.log($("#attackContainer").is(":hidden"))
		if ($("#attackContainer").is(":hidden")){
			$("#attackContainer").toggle();
		}
	})

	//Attack Function
	$("#attack").on("click", function(){
		if (defenderPosition == null) {
			//show message to pick defender
			$("#turnMessage").text("")
			$("#gameMessage").text("Please pick a defender.")
		}
		else {
			attack(attackerPosition, defenderPosition, characters, multiplier);
			outputStats(characters);
			//Show Message for turn
			var attackerName = characters[attackerPosition].characterName;
			var attackerPoint = characters[attackerPosition].attackPower;
			var defenderName = characters[defenderPosition].characterName;
			var defenderPoint = characters[defenderPosition].attackPower;
			$("#turnMessage").html(attackerName + " has <span class='attackMessage'>DAMAGED</span> "+ defenderName + " for " + attackerPoint + " points.  <br />"
									+ defenderName + " has countered attacked by " + defenderPoint + " points!")

			results = checkCondition(attackerPosition, defenderPosition, characters, remainingEnemies);
			remainingEnemies = results[0];
			defenderPosition = results[1];
			loseScore = results[2];

			if (remainingEnemies == 0) {
				//Show Message
				winScore++;
				$("#winScore span").text(winScore);
				$("#message").text("You Won")
				$(".modal").modal()
			}
		}
	})

	//Modal was closed, reset game
	$('.modal').on('hidden.bs.modal', function () {
		characters = initCharacters(gameThemeSelected);
		outputStats(characters);
		$("div[id^='character']").appendTo($("#initialContainer"));
		$("div[id^='character'] div:first-child").removeClass();
		$("div[id^='character'] div:first-child").addClass("character");
		$("#gameMessage").text("Choose a character!");
		$("#turnMessage").html("");
		$("#attackContainer").toggle();
		remainingEnemies = characters.length - 1;
	})
});

function initCharacters(gameThemeSelected){
	var characters = [
		{ characterName: "Character 01",
			attackPower: 10,
			counterPower: 25,
			healthAmount: 1300,
			imgSrc: "assets/images/" + gameThemeSelected + "/char_01.png",
			selected: false
		},
		{characterName: "Character 02",
			attackPower: 2,
			counterPower: 25,
			healthAmount: 130,
			imgSrc: "assets/images/" + gameThemeSelected + "/char_02.png",
			selected: false
		},
		{characterName: "Character 03",
			attackPower: 3,
			counterPower: 25,
			healthAmount: 130,
			imgSrc: "assets/images/" + gameThemeSelected + "/char_03.png",
			selected: false
		},
		{characterName: "Character 04",
			attackPower: 4,
			counterPower: 5,
			healthAmount: 130,
			imgSrc: "assets/images/" + gameThemeSelected + "/char_04.png",
			selected: false
		}
	]
	$("body").removeClass();
	$("body").addClass("container " + gameThemeSelected);

	return characters
}
function moveCharacters(characters){
	for (var i = 0; i < characters.length; i++){
		if (characters[i].selected == true) {
			var selectedCharacter = characters[i].characterName;
			$("[data-position= '"+ i+"']").parent().closest('div').appendTo($("#attackerContainer"));
			$("[data-position= '"+ i+"']").parent().closest('div').addClass("col-md-3 col-sm-6");
			$("[data-position= '"+ i+"']").removeClass("character");
			$("[data-position= '"+ i+"']").addClass("attacker");
		}
		else {
			var selectedCharacter = characters[i].characterName;
			$("[data-position= '"+ i+"']").parent().closest('div').appendTo($("#pendingContainer"));
			$("[data-position= '"+ i+"']").parent().closest('div').addClass("col-md-3 col-sm-6");
			$("[data-position= '"+ i+"']").removeClass("character");
			$("[data-position= '"+ i+"']").addClass("pending");
		}
	}
}

function moveDefender(characters){
	for (var i = 0; i < characters.length; i++){
		if (characters[i].selected == "defender") {
			var selectedCharacter = characters[i].characterName;
			$("[data-position= '"+ i+"']").parent().closest('div').appendTo($("#defenderContainer"));
			$("[data-position= '"+ i+"']").parent().closest('div').addClass("col-md-3 col-sm-6");
			$("[data-position= '"+ i+"']").removeClass("pending");
			$("[data-position= '"+ i+"']").addClass("defender");
		}
		else if (characters[i].selected == false){
			var selectedCharacter = characters[i].characterName;
			$("[data-position= '"+ i+"']").parent().closest('div').appendTo($("#pendingContainer"));
			$("[data-position= '"+ i+"']").parent().closest('div').addClass("col-md-3 col-sm-6");
			$("[data-position= '"+ i+"']").removeClass("defender");
			$("[data-position= '"+ i+"']").addClass("pending");
		}
	}
}

function attack(attacker, defender, characters, multiplier) {
	//Remove health from defender
	characters[defender].healthAmount = characters[defender].healthAmount - characters[attacker].attackPower;

	//Counter Attack from defender
	characters[attacker].healthAmount = characters[attacker].healthAmount - characters[defender].counterPower;

	//Double Attacker power
	characters[attacker].attackPower = (characters[attacker].attackPower * multiplier) + characters[attacker].attackPower;
}

function outputStats(characters) {
	for (var i = 0; i < characters.length; i++){
		var j = i + 1;
		var health = $("<span>").html(characters[i].healthAmount + " Health Points");
		var image = $("<span>").html(characters[i].healthAmount + " Health Points");
		$("#char_" + j + '_health').html(health)
		$("#char_" + j  + " img").attr("src", characters[i].imgSrc)
	}
}

function checkCondition(attacker, defender, characters, remainingEnemies, loseScore) {
	//Check if attacker health is less than 0
	if (characters[attacker].healthAmount < 0) {
		//Show Message
		loseScore++;
		$("#loseScore span").text(loseScore);
		$("#message").text("You Lost")
		$(".modal").modal()
	}
	//Check if defender has health less than 0
	if (characters[defender].healthAmount < 0) {
		//Move defender to PENDING container
		characters[defender].selected == "defeated";
		$("[data-position= '"+ defender +"']").parent().closest('div').appendTo($("#pendingContainer"));
		$("[data-position= '"+ defender +"']").parent().closest('div').addClass("col-md-3 col-sm-6");
		$("[data-position= '"+ defender +"']").removeClass("defender");	
		$("[data-position= '"+ defender +"']").addClass("defeated");	
		//Message that defender has been defeated
		$("#turnMessage").append("<br />" + characters[defender].characterName + " has been defeated!  Please select another character!")
		defender = null;
		remainingEnemies = remainingEnemies - 1;
	}
	return [remainingEnemies, defender, loseScore]
}