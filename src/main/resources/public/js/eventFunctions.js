// Initiating shells

var closeInputAndContinue = function(closeInput, shellElement, text, nextQuery) {
    closeInput();
    shell_addText(shellElement, text);
    shell_addText(shellElement, '');
    shell_addQuery(shellElement, nextQuery);
}

var generateEnforcedQuery = function(enforcedText, nextQuery, shellElement, qualmId, additionalFunc) {
    return {
        pretext: '|?- ',
        text: enforcedText,
        callback: function(input, closeInput) {
            if (input != enforcedText) {
                alert('Please input: ' + enforcedText);
            } else {
                sendQuery(input, function(data) {
                    closeInputAndContinue(closeInput, shellElement, data, nextQuery);
                    if (additionalFunc) {
                        additionalFunc();
                    }
                }, qualmId);
            }
        }
    }
}

var generateStandardQuery = function(nextQuery, shellElement, qualmId, additionalFunc) {
    return {
        pretext: '|?- ',
        text: '',
        callback: function(input, closeInput) {
            sendQuery(input, function(data) {
                if (!nextQuery) {
                    nextQuery = generateStandardQuery(null, shellElement, qualmId, additionalFunc);
                }
                closeInputAndContinue(closeInput, shellElement, data, nextQuery);
                if (additionalFunc) {
                    additionalFunc();
                }
            }, qualmId);
        }
    }
}

var initShellBystander2 = function() {
    console.log('initiating shell [bystander2]');
    var elems = {};
    elems.container = $('#shell-bystander2');
    elems.info = $('<div/>', { class: 'alert alert-info' });
    elems.shell = $('<div/>', { class: 'modal-shell' });
    elems.container.empty();
    elems.container.append(elems.shell);
    elems.container.append(elems.info);

    var qualmId = genQualmId();

    var text0 = 'The first step is to find an explanation of the factual situation. Using QUALM, we can find this explanation by using abductive reasoning with predicate: findAbds/2';
    var text1 = 'Upon finding the explanation, let\'s commit the abduced context in which the counterfactual is evaluated (“all other things being equal”). QUALM allows the updating of logic program by using predicate updateAbds/1.'
    var text2 = 'The second step is to do a hypothetical intervention. This intervention is performed in QUALM by enacting a hypothetical update due to the antecedent of the counterfactual (in this case: <b>hadNot(hit(1))</b>), affecting defeasible rules introduced for this evaluation';
    var text3 = 'The third step is to verify the consequence of the counterfactual (in this case: <b>wouldHaveNot(save(5))</b>). This step determines the validity of the counterfactual statement.';
    var text4 = 'Because the query yields the answer: <b>no</b>, it means the counterfactual is not valid.<br><br>Currently the evaluation is held at a hypothetical state. To return to the factual state, you can simply query: undoIntervention([hadNot(hit(1))]).';
    
    var query5 = generateStandardQuery(null, elems.shell, qualmId);
    var query4 = generateEnforcedQuery('verify([wouldHaveNot(save(5))]).', query5, elems.shell, qualmId, function() { changeText(elems.info, text4); });
    var query3 = generateEnforcedQuery('intervene([hadNot(hit(1))]).', query4, elems.shell, qualmId, function() { changeText(elems.info, text3); });
    var query2 = generateEnforcedQuery('updateAbds([pull_switch]).', query3, elems.shell, qualmId, function() { changeText(elems.info, text2); });
    var query1 = generateEnforcedQuery('findAbds([hit(1), save(5)], X).', query2, elems.shell, qualmId, function() { changeText(elems.info, text1); });

    elems.info.html(text0);
    shell_addQuery(elems.shell, query1);

    initQualm('trolley1', qualmId);
}

var initShellBridge2 = function() {
    console.log('initiating shell [bridge2]');
    var elems = {};
    elems.container = $('#shell-bridge2');
    elems.info = $('<div/>', { class: 'alert alert-info' });
    elems.shell = $('<div/>', { class: 'modal-shell' });
    elems.container.empty();
    elems.container.append(elems.shell);
    elems.container.append(elems.info);

    var qualmId = genQualmId();

    var text0 = 'The first step is to find an explanation of the factual situation. Using QUALM, we can find this explanation by using abductive reasoning with predicate: findAbds/2';
    var text1 = 'Upon finding the explanation, let\'s commit the abduced context in which the counterfactual is evaluated (“all other things being equal”). QUALM allows the updating of logic program by using predicate updateAbds/1.'
    var text2 = 'The second step is to do a hypothetical intervention. This intervention is performed in QUALM by enacting a hypothetical update due to the antecedent of the counterfactual (in this case: <b>hadNot(hit(1))</b>), affecting defeasible rules introduced for this evaluation';
    var text3 = 'The third step is to verify the consequence of the counterfactual (in this case: <b>wouldHaveNot(save(5))</b>). This step determines the validity of the counterfactual statement.';
    var text4 = 'Because the query yields the answer: <b>yes</b>, it means the counterfactual is valid.<br><br>Currently the evaluation is held at a hypothetical state. To return to the factual state, you can simply query: undoIntervention([hadNot(hit(1))]).';
    
    var query5 = generateStandardQuery(null, elems.shell, qualmId);
    var query4 = generateEnforcedQuery('verify([wouldHaveNot(save(5))]).', query5, elems.shell, qualmId, function() { changeText(elems.info, text4); });
    var query3 = generateEnforcedQuery('intervene([hadNot(hit(1))]).', query4, elems.shell, qualmId, function() { changeText(elems.info, text3); });
    var query2 = generateEnforcedQuery('updateAbds([push(1)]).', query3, elems.shell, qualmId, function() { changeText(elems.info, text2); });
    var query1 = generateEnforcedQuery('findAbds([hit(1), save(5)], X).', query2, elems.shell, qualmId, function() { changeText(elems.info, text1); });

    elems.info.html(text0);
    shell_addQuery(elems.shell, query1);

    initQualm('trolley2', qualmId);
}

var initShellBystander1 = function() {
    console.log('initiating shell [bystander1]');
    var elems = {};
    elems.container = $('#shell-bystander1');
    elems.info = $('<div/>', { class: 'alert alert-info' });
    elems.shell = $('<div/>', { class: 'modal-shell' });
    elems.container.empty();
    elems.container.append(elems.shell);
    elems.container.append(elems.info);

    var qualmId = genQualmId();

    var text0 = 'Abductive reasoning is employed to find actions for achieving a given goal (in this case, <b>follow_utilitarian</b>). By using QUALM, abduction can be enacted using predicate findAbds/2';
    var text1 = 'Abduction results in unifying X with the abductive solution (<b>pull_switch</b>) that refers to the action for achieving the goal (<b>follow_utilitarian</b>).'
    
    var query2 = generateStandardQuery(null, elems.shell, qualmId);
    var query1 = generateEnforcedQuery('findAbds(follow_utilitarian, X).', query2, elems.shell, qualmId, function() { changeText(elems.info, text1); });

    elems.info.html(text0);
    shell_addQuery(elems.shell, query1);

    initQualm('trolley1', qualmId);
}

var initShellBridge1 = function() {
    console.log('initiating shell [bridge1]');
    var elems = {};
    elems.container = $('#shell-bridge1');
    elems.info = $('<div/>', { class: 'alert alert-info' });
    elems.shell = $('<div/>', { class: 'modal-shell' });
    elems.container.empty();
    elems.container.append(elems.shell);
    elems.container.append(elems.info);

    var qualmId = genQualmId();

    var text0 = 'Abductive reasoning is employed to find actions for achieving a given goal (in this case, <b>follow_utilitarian</b>). By using QUALM, abduction can be enacted using predicate findAbds/2';
    var text1 = 'Abduction results in unifying X with the abductive solution (<b>push(1)</b>) that refers to the action for achieving the goal (<b>follow_utilitarian</b>).'
    
    var query2 = generateStandardQuery(null, elems.shell, qualmId);
    var query1 = generateEnforcedQuery('findAbds(follow_utilitarian, X).', query2, elems.shell, qualmId, function() { changeText(elems.info, text1); });

    elems.info.html(text0);
    shell_addQuery(elems.shell, query1);

    initQualm('trolley2', qualmId);
}

var initShellTeb = function() {
    console.log('initiating shell [teb]');
    var elems = {};
    elems.container = $('#shell-teb');
    elems.container.empty();
    elems.info = $('<div/>', { class: 'alert alert-info' });
    elems.shell = $('<div/>', { class: 'modal-shell' });
    elems.container.append(elems.shell);
    elems.container.append(elems.info);

    var qualmId = genQualmId();

    var text0 = 'The first step is to find an explanation of the factual situation. Using QUALM, we can find this explanation by using abductive reasoning with predicate: findAbds/2';
    var text1 = 'Upon finding the explanation, let\'s commit the abduced context in which the counterfactual is evaluated (“all other things being equal”). QUALM allows the updating of logic program by using predicate updateAbds/1.'
    var text2 = 'The second step is to do a hypothetical intervention. This intervention is performed in QUALM by enacting a hypothetical update due to the antecedent of the counterfactual (in this case: <b>hadNot(killCivilian)</b>), affecting defeasible rules introduced for this evaluation';
    var text3 = 'The third step is to verify the consequence of the counterfactual (in this case: <b>wouldHaveNot(endWar)</b>). This step determines the validity of the counterfactual statement.';
    var text4 = 'Because the query yields the answer: <b>yes</b>, it means the counterfactual is valid.<br><br>Currently the evaluation is held at a hypothetical state. To return to the factual state, you can simply query: undoIntervention([not killCivilian]).';
    
    var query5 = generateStandardQuery(null, elems.shell, qualmId);
    var query4 = generateEnforcedQuery('verify([wouldHaveNot(endWar)]).', query5, elems.shell, qualmId, function() { changeText(elems.info, text4); });
    var query3 = generateEnforcedQuery('intervene([hadNot(killCivilian)]).', query4, elems.shell, qualmId, function() { changeText(elems.info, text3); });
    var query2 = generateEnforcedQuery('updateAbds([terrorBombing]).', query3, elems.shell, qualmId, function() { changeText(elems.info, text2); });
    var query1 = generateEnforcedQuery('findAbds([killCivilian, endWar], X).', query2, elems.shell, qualmId, function() { changeText(elems.info, text1); });

    elems.info.html(text0);
    shell_addQuery(elems.shell, query1);

    initQualm('teb', qualmId);
}

var initShellTab = function() {
    console.log('initiating shell [tab]');
    var elems = {};
    elems.container = $('#shell-tab');
    elems.info = $('<div/>', { class: 'alert alert-info' });
    elems.shell = $('<div/>', { class: 'modal-shell' });
    elems.container.empty();
    elems.container.append(elems.shell);
    elems.container.append(elems.info);

    var qualmId = genQualmId();
    
    var text0 = 'The first step is to find an explanation of the factual situation. Using QUALM, we can find this explanation by using abductive reasoning with predicate: findAbds/2';
    var text1 = 'Upon finding the explanation, let\'s commit the abduced context in which the counterfactual is evaluated (“all other things being equal”). QUALM allows the updating of logic program by using predicate updateAbds/1.'
    var text2 = 'The second step is to do a hypothetical intervention. This intervention is performed in QUALM by enacting a hypothetical update due to the antecedent of the counterfactual (in this case: <b>hadNot(killCivilian)</b>), affecting defeasible rules introduced for this evaluationt';
    var tex3 = 'The third step is to verify the consequence of the counterfactual (in this case: <b>wouldHaveNot(endWar)</b>). This step determines the validity of the counterfactual statement.';
    var text4 = 'Because the query yields the answer: <b>no</b>, it means the counterfactual is not valid.<br><br>Currently the evaluation is held at a hypothetical state. To return to the factual state, you can simply query: undoIntervention([not killCivilian]).';
    
    var query5 = generateStandardQuery(null, elems.shell, qualmId);
    var query4 = generateEnforcedQuery('verify([wouldHaveNot(endWar)]).', query5, elems.shell, qualmId, function() { changeText(elems.info, text4); });
    var query3 = generateEnforcedQuery('intervene([hadNot(killCivilian)]).', query4, elems.shell, qualmId, function() { changeText(elems.info, text3); });
    var query2 = generateEnforcedQuery('updateAbds([tacticalBombing]).', query3, elems.shell, qualmId, function() { changeText(elems.info, text2); });
    var query1 = generateEnforcedQuery('findAbds([killCivilian, endWar], X).', query2, elems.shell, qualmId, function() { changeText(elems.info, text1); });

    elems.info.html(text0);
    shell_addQuery(elems.shell, query1);

    initQualm('tab', qualmId);
}


// Scene Functions

var querySleepTime = 2000;

var func_john_reasoning_bystander = function() {
    var qualmId = genQualmId();
    initQualm('trolley1', qualmId);
    sendQuery('findAbds(follow_utilitarian, X).', function(data) {
        if (data.replace('X = ', '') === '[pull_switch]') {
            changeText(elements.theater.bubbleContent, events[currentEvent].bubble2);
            changeText(elements.theater.narration, events[currentEvent].text2);
        } else {
            alert('Something error...');
            console.log('got unexpected response', data);
        }
        closeQualm(qualmId);
    }, qualmId, querySleepTime)
}

var func_john_reasoning_bridge = function() {
    var qualmId = genQualmId();
    initQualm('trolley2', qualmId);
    sendQuery('findAbds(follow_utilitarian, X).', function(data) {
        if (data.replace('X = ', '') === '[push(1)]') {
            changeText(elements.theater.bubbleContent, events[currentEvent].bubble2);
            changeText(elements.theater.narration, events[currentEvent].text2);
        } else {
            alert('Something error...');
            console.log('got unexpected response', data);
        }
        closeQualm(qualmId);
    }, qualmId, querySleepTime)
}

var func_harry_reasoning_bystander = function() {
    var qualmId = genQualmId();
    initQualm('trolley1', qualmId);
    sendQuery('evalCounterfactual((hadNot(hit(1)) then wouldHaveNot(save(5)))).', function(data) {
        if (data === 'no') {
            changeText(elements.theater.bubbleContent, events[currentEvent].bubble2);
        } else {
            alert('Something error...');
            console.log('got unexpected response', data);
        }
        closeQualm(qualmId);
    }, qualmId, querySleepTime)
}

var func_harry_reasoning_bridge = function() {
    var qualmId = genQualmId();
    initQualm('trolley2', qualmId);
    sendQuery('evalCounterfactual((hadNot(hit(1)) then wouldHaveNot(save(5)))).', function(data) {
        if (data === 'yes') {
            changeText(elements.theater.bubbleContent, events[currentEvent].bubble2);
        } else {
            alert('Something error...');
            console.log('got unexpected response', data);
        }
        closeQualm(qualmId);
    }, qualmId, querySleepTime)
}

var bombing_has_done = { teb: false, tab: false };

var func_bombing_action = function() {
    $('button:contains("Next...")').hide();
    // $(':contains("Terror Bombing..")').prop('disabled', false);
    // $(':contains("Terror Bombing..")').prop('disabled', false);
    $('button:contains("Tactical Bombing..")').on('click', function() { bombing_has_done.tab = true; });
    $('button:contains("Terror Bombing..")').on('click', function() { bombing_has_done.teb = true; });

    if (bombing_has_done.teb && bombing_has_done.tab) {
        elements.theater.narration.text('After assessing both choices (terror bombing or tactical bombing), Grumman resorts to a decision...'); 
        $('button:contains("Next...")').fadeIn();
        $('button:contains("Terror Bombing..")').hide();
        $('button:contains("Tactical Bombing..")').hide();
        bombing_has_done.teb = false;
        bombing_has_done.tab = false;
    }
    // } else if (bombing_has_done.teb) {
    //     $(':contains("Terror Bombing..")').prop('disabled', true);
    // } else if (bombing_has_done.tab) {
    //     $(':contains("Tactical Bombing..")').prop('disabled', true);
    // }
}

var func_bombing_reasoning_teb = function() {
    var qualmId = genQualmId();
    initQualm('teb', qualmId);
    sendQuery('evalCounterfactual((hadNot(killCivilian) then wouldHaveNot(endWar))).', function(data) {
        if (data === 'yes') {
            changeText(elements.theater.bubbleContent, events[currentEvent].bubble2);
            changeText(elements.theater.narration, events[currentEvent].text2);
        } else {
            alert('Something error...');
            console.log('got unexpected response', data);
        }
        closeQualm(qualmId);
    }, qualmId, querySleepTime)
}

var func_bombing_reasoning_tab = function() {
    var qualmId = genQualmId();
    initQualm('tab', qualmId);
    sendQuery('evalCounterfactual((hadNot(killCivilian) then wouldHaveNot(endWar))).', function(data) {
        if (data === 'no') {
            changeText(elements.theater.bubbleContent, events[currentEvent].bubble2);
            changeText(elements.theater.narration, events[currentEvent].text2);
        } else {
            alert('Something error...');
            console.log('got unexpected response', data);
        }
        closeQualm(qualmId);
    }, qualmId, querySleepTime)
}
