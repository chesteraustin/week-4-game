$( document ).ready(function() {
	var attackerPosition;
	var defenderPosition;
	var characters =  initCharacters();
	var remainingEnemies = characters.length - 1;
	outputStats(characters);

	//SELECT ATTACKER
	$(".characterContainer").on("click", ".character", function(){
		var attacker = characters[$(this).attr("data-position")]
		attacker.selected = true;
		attackerPosition = [$(this).attr("data-position")];
		moveCharacters(characters);
	})

	//SELECT DEFENDER
	$(".characterContainer").on("click", ".pending", function(){
		//Clear message
		$("#gameMessage").text("I am ready!");
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
		$("#attackContainer").show();
	})

	//Attack Function
	$("#attack").on("click", function(){
		if (defenderPosition == null) {
			//show message to pick defender
			$("#gameMessage").text("Please pick a defender.")
		}
		else {
			attack(attackerPosition, defenderPosition, characters);
			outputStats(characters);
			results = checkCondition(attackerPosition, defenderPosition, characters, remainingEnemies);
			remainingEnemies = results[0];
			defenderPosition = results[1];

			if (remainingEnemies == 0) {
				//Show Message
				$("#message").text("You Won")
				$(".modal").modal()
			}
		}
	})

	//Modal was closed, reset game
	$('.modal').on('hidden.bs.modal', function () {
		characters = initCharacters();
		outputStats(characters);
		$("div[id^='character']").appendTo($("#initialContainer"));
		$("div[id^='character'] span:first-child").removeClass();
		$("div[id^='character'] span:first-child").addClass("character");
		$("#attack").hide();
	})
});

function initCharacters(){
	var characters = [
		{ characterName: "Character 01",
			attackPower: 125,
			counterPower: 120,
			healthAmount: 1300,
			selected: false
		},
		{characterName: "Character 02",
			attackPower: 2,
			counterPower: 120,
			healthAmount: 130,
			selected: false
		},
		{characterName: "Character 03",
			attackPower: 3,
			counterPower: 120,
			healthAmount: 130,
			selected: false
		},
		{characterName: "Character 04",
			attackPower: 4,
			counterPower: 5,
			healthAmount: 130,
			selected: false
		}
	]
	return characters
}
function moveCharacters(characters){
	for (var i = 0; i < characters.length; i++){
		if (characters[i].selected == true) {
			var selectedCharacter = characters[i].characterName;
			$("[data-position= '"+ i+"']").parent().closest('div').appendTo($("#attackerContainer"));
			$("[data-position= '"+ i+"']").removeClass("character");
			$("[data-position= '"+ i+"']").addClass("attacker");
		}
		else {
			var selectedCharacter = characters[i].characterName;
			$("[data-position= '"+ i+"']").parent().closest('div').appendTo($("#pendingContainer"));
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
			$("[data-position= '"+ i+"']").removeClass("pending");
			$("[data-position= '"+ i+"']").addClass("defender");
		}
		else if (characters[i].selected == false){
			var selectedCharacter = characters[i].characterName;
			$("[data-position= '"+ i+"']").parent().closest('div').appendTo($("#pendingContainer"));
			$("[data-position= '"+ i+"']").removeClass("defender");
			$("[data-position= '"+ i+"']").addClass("pending");
		}
	}
}

function attack(attacker, defender, characters) {
	//Remove health from defender
	characters[defender].healthAmount = characters[defender].healthAmount - characters[attacker].attackPower;

	//Counter Attack from defender
	characters[attacker].healthAmount = characters[attacker].healthAmount - characters[defender].counterPower;

	//Double Attacker power
	characters[attacker].attackPower = characters[attacker].attackPower * characters[attacker].attackPower;
}

function outputStats(characters) {
	for (var i = 0; i < characters.length; i++){
		var j = i + 1;
		var health = $("<span>").html(characters[i].healthAmount + " Health Points");
		$("#char_" + j + '_health').html(health)
	}
}

function checkCondition(attacker, defender, characters, remainingEnemies) {
	//Check if attacker health is less than 0
	if (characters[attacker].healthAmount < 0) {
		//Show Message
		$("#message").text("You Lost")
		$(".modal").modal()
	}
	//Check if defender has health less than 0
	if (characters[defender].healthAmount < 0) {
		//Move defender to PENDING container
		characters[defender].selected == "defeated";
		$("[data-position= '"+ defender +"']").parent().closest('div').appendTo($("#pendingContainer"));
		$("[data-position= '"+ defender +"']").removeClass("defender");	
		defender = null;
		remainingEnemies = remainingEnemies - 1;
	}
	return [remainingEnemies, defender]
}