// Variables and Constants
var EVENTS_URL = 'js/events.json';
var IMAGE_DIR_URL = 'assets/images/';
var DEFAULT_EVENT = 'main.title';
var URL_QUALM_INIT = 'qualm/init';
var URL_QUALM_QUERY = 'qualm/query';
var URL_QUALM_CLOSE = 'qualm/close';

var events;
var currentScreen;
var currentEvent;
var currentModal;
var currentModalTimeout;

var images = [
     'bombing1.gif',
     'bombing2.gif',
     'bombing3.gif',
     'bombing4.gif',
     'bombing5.gif',
     'bombing6.gif',
     'bubble_harry.gif',
     'bubble_john.gif',
     'plane.gif',
     'trolley_bridge1_action.gif',
     'trolley_bridge1_intro1.gif',
     'trolley_bridge1_intro2.gif',
     'trolley_bridge1_response_all3.gif',
     'trolley_bridge2_intro1.gif',
     'trolley_bridge2_intro2.gif',
     'trolley_bridge2_intro5.gif',
     'trolley_bystander1_intro1.gif',
     'trolley_bystander1_intro2.gif',
     'trolley_bystander1_intro3.gif',
     'trolley_bystander1_intro4.gif',
     'trolley_bystander1_intro5.gif',
     'trolley_bystander1_response_all3.gif',
     'trolley_bystander2_intro1.gif',
     'trolley_bystander2_intro2.gif',
     'trolley_bystander2_intro6.gif',
     'help1.jpg',
     'help2.jpg',
     'help3.jpg',
     'help4.jpg',
];

var img_cache = {};

var screen = {
    title: $('#titlescreen'),
    info: $('#infoscreen'),
    theater: $('#theaterscreen'),
    full: $('#fullscreen'),    
    loading: $('#loadingscreen'),
};

var elements = {
    screen: {
        screen: $('#screen'),
    },
    theater: {
        narration: $('#theater-narration'),
        actions: $('#theater-action-container'),
        bubbleContent: $('#theater-bubble-content'),
        bubble: $('#theater-bubble'),
        illustration: $('#theater-illustration'),
        bubbleIllustration: $('#theater-bubble-illustration'),
    },
    info: {
        content: $('#info-content'),
        actions: $('#info-action-container'),
    },
    modal: {
        modal: $('#modal'),
        content: $('#modal-content'),
        title: $('#modal-title'),
        closeIcon: $('#modal-close-icon'),
        closeButton: $('#modal-close-btn'),
        dialog: $('#modal-dialog'),
    },
    idea: {
        text: $('#idea-text'),
        button: $('#idea-btn'),
        notification: $('#idea-notif'),
    },
    title: {
        actionStart: $('#title-action-start'),
        actionStartBombing: $('#title-action-start-bombing'),
    },
    menu: {
        home: $('#menu-home'),
        sound: $('#menu-sound'),
        nav: $('#menu-nav'),
        help: $('#menu-help'),
    },
    help: {
        modal: $('#modal-help'),
        image: $('#img-help'),
    },
};

var sound = {
    click: new Howl({ src: ['assets/sounds/click.mp3'] }),
    bgm: new Howl({ src: ['assets/sounds/bgm.mp3'], loop: true }),
    alert: new Howl({ src: ['assets/sounds/alert.mp3'] }),
};


// Screen
var useScreen = function(name) {
    if (currentScreen == name) return;

    screen.info.hide();
    screen.theater.hide();
    screen.full.hide();
    screen.title.hide();
    screen.loading.hide();
    
    screen[name].show();
};

var setIllustration = function(screen, imageUrl) {
    elements[screen].illustration.attr('src', IMAGE_DIR_URL + imageUrl);
}

var setBubbleIllustration = function(screen, imageUrl) {
    if (imageUrl) {
        elements[screen].bubbleIllustration.attr('src', IMAGE_DIR_URL + imageUrl);
        elements[screen].bubbleIllustration.fadeIn();
    } else {
        elements[screen].bubbleIllustration.hide();
    }
}


// Button
var createActionBtn = function(text, callback) {
    var btn = $('<button />', { text: text, click: callback, class: "btn-default btn-action" });
    btn.on('click', function() { sound.click.play(); });
    return btn;
}

var setActionButtonNext = function(screen, next) {
    setActionButtonOptions(screen, [{ text: 'Next', next: next }]);
}

var setActionButtonOptions = function(screen, options) {
    elements[screen].actions.empty()
    options.forEach(function(option) {
        elements[screen].actions.append(createActionBtn(option.text, function() {
            currentEvent = option.next;
            loadEvent(currentEvent);
        }));    
    });
}


// Event
var loadEvent = function(eventId, transition) {
    if (transition) { elements.screen.screen.hide(); };
    window.location.hash = eventId;
    if (events[eventId].checkpoint) {
        elements.menu.nav.val(eventId);
    }
    if (transition) { elements.screen.screen.fadeIn(); };
};

var actuateEvent = function(eventId) {
    var event = events[eventId];
    console.log(event);

    if (eventId.indexOf('bombing') !== -1) {
        elements.theater.illustration.removeClass('illustration');
        elements.theater.illustration.addClass('illustration-bombing');
    } else {
        elements.theater.illustration.removeClass('illustration-bombing');
        elements.theater.illustration.addClass('illustration');
    }

    if (event.type === 'narration') {
        useScreen('theater');
        changeText(elements.theater.narration, event.text);
        setActionButtonNext('theater', event.next);
        setIllustration('theater', event.illustration);
        setBubbleIllustration('theater', event.bubble_illustration);

        // if (event.text.length > 200) {
        //     elements.theater.narration.css('font-size', '1.0rem');
        // } else if (event.text.length > 100) {
        //     elements.theater.narration.css('font-size', '1.2rem');
        // } else {
        //     elements.theater.narration.css('font-size', '1.4rem');            
        // }


    } else if (event.type === 'option') {
        useScreen('theater');
        changeText(elements.theater.narration, event.text);
        setActionButtonOptions('theater', event.options);
        setIllustration('theater', event.illustration);
        setBubbleIllustration('theater', event.bubble_illustration);

    } else if (event.type === 'info') {
        useScreen('info');
        changeText(elements.info.content, event.text);
        if (event.options) {
            setActionButtonOptions('info', event.options);
        } else {
            setActionButtonNext('info', event.next);
        }

        if (event.text.length > 500) {
            elements.info.content.css('font-size', '1.0rem');
        } else if (event.text.length > 250) {
            elements.info.content.css('font-size', '1.2rem');
        } else {
            elements.info.content.css('font-size', '1.5rem');            
        }

    } else if (event.type === 'title') {
        useScreen('title');
    }

    if (event.bubble) {
        changeText(elements.theater.bubbleContent, event.bubble);
        elements.theater.bubble.show();
    } else {
        elements.theater.bubbleContent.html("");
        elements.theater.bubble.hide();
    }

    if (event.modal) {
        setContentModal(event.modal);
    }

    currentModalTimeout -= 1;
    if (currentModalTimeout <= 0) {
        setContentModal(null);
    }

    if (event.func) {
        window[event.func]();
    }
}

// Misc
var changeText = function(element, text) {
    var normalized = normalizeText(text);
    if (element.html() != normalized) {
        element.hide();
        element.html(normalized).fadeIn();
    }
}

var normalizeText = function(text) {
    if (text) {
        return text.replace(/\n/g, '<br>');        
    }
};

var initEvents = function(callback) {
    $.getJSON(EVENTS_URL, function(data) {
        callback(data);
    });
};

var preload = function(srcs, callback) {
    var img;
    var remaining = srcs.length;
    for (var i = 0; i < srcs.length; i++) {
        img = new Image();
        img.onload = function() {
            --remaining;
            if (remaining <= 0) {
                callback();
            }
        };
        img.src = IMAGE_DIR_URL + srcs[i];
        img_cache[srcs[i]] = img;
    }
}

// Modal
var showModal = function() {
    if (currentModal && currentModal.type && currentModal.type === 'large') {
        elements.modal.dialog.addClass('modal-lg');
    } else {
        elements.modal.dialog.removeClass('modal-lg');        
    }
    elements.modal.modal.show();
    console.log('Showing modal', currentModal);
    if (currentModal && currentModal.function) {
        window[currentModal.function]();
    };
}

var closeModal = function(modal) {
    elements.modal.modal.hide();
}

var setContentModal = function(modal) {
    if (!modal) {
        currentModal = null;
        elements.idea.text.hide();
        elements.idea.notification.hide();
        elements.modal.content.html('Expect some useful information here.');
        elements.modal.title.text('Idea dialog');

    } else {
        currentModal = modal;
        currentModalTimeout = 3;

        if (elements.modal.content.html() != normalizeText(modal.content)) {
            
            elements.modal.content.html(normalizeText(modal.content));
            elements.modal.title.text(modal.title);
        
            elements.idea.text.hide();
            elements.idea.notification.hide();
        
            elements.idea.text.text(modal.title);

            elements.idea.text.fadeIn();
            elements.idea.notification.fadeIn();
            sound.alert.play();
        }
    }
}

// Help
var showHelp = function() {
    var helpImages = ['help1.jpg', 'help2.jpg', 'help3.jpg', 'help4.jpg'];

    var showNext = function(nextImg, nextFunc) {
        return function() {
            elements.help.image.attr('src', IMAGE_DIR_URL + nextImg);
            elements.help.image.on('click', nextFunc)
        };
    };

    elements.help.image.attr('src', IMAGE_DIR_URL + helpImages[0]);
    elements.help.image.click(function() {
        elements.help.image.unbind('click');
        elements.help.image.attr('src', IMAGE_DIR_URL + helpImages[1]);
        elements.help.image.on('click', function() {
            elements.help.image.unbind('click');
            elements.help.image.attr('src', IMAGE_DIR_URL + helpImages[2]);
            elements.help.image.on('click', function() {
                elements.help.image.unbind('click');
                elements.help.image.attr('src', IMAGE_DIR_URL + helpImages[3]);
                elements.help.image.on('click', function() {
                    elements.help.image.unbind('click');
                    closeHelp();
                });
            });
        });
    })

    elements.help.modal.fadeIn();
}

var closeHelp = function() {
    elements.help.modal.fadeOut();
}

// Init
var init = function() {
    useScreen('loading');
    preload(images, function() {
        initEvents(function(data) {
            events = data;
            initGuiPostData();
            var initialEvent = window.location.hash ? window.location.hash.substr(1) : DEFAULT_EVENT;
            currentEvent = initialEvent;
            actuateEvent(initialEvent);

            if (window.location.hash) {
                if (!sound.bgm.playing()) {
                    sound.bgm.play();
                }
            }
        });
    });

    $(window).on('popstate', function() {
        var event = window.location.hash ? window.location.hash.substr(1) : DEFAULT_EVENT;
        currentEvent = event;
        actuateEvent(event);
    });

    initGui();
}

var initGui = function() {
    elements.modal.modal.hide();
    elements.idea.notification.hide();
    elements.help.modal.hide();

    elements.title.actionStart.on('click', function() {
        currentEvent = 'trolley.intro.intro1';
        if (!sound.bgm.playing()) {
            sound.bgm.play();
        }
        loadEvent(currentEvent);
    });

    elements.title.actionStartBombing.on('click', function() {
        currentEvent = 'bombing.intro.intro1';
        if (!sound.bgm.playing()) {
            sound.bgm.play();
        }
        loadEvent(currentEvent);
    });

    elements.idea.button.on('click',function() {
        if (elements.modal.content.html().trim() != '<p>Expect some useful information here.</p>') {
            showModal();
            elements.idea.notification.hide();
            elements.idea.text.fadeOut();
        }
    })

    elements.modal.closeButton.on('click', function() { closeModal(); });
    elements.modal.closeIcon.on('click', function() { closeModal(); });

    elements.menu.home.on('click', function() {
        loadEvent('main.title');
    })

    elements.menu.sound.on('click', function() {
        if (elements.menu.sound.text() == 'Sound: ON') {
            elements.menu.sound.text('Sound: OFF');
            sound.bgm.mute(true);
        } else {
            elements.menu.sound.text('Sound: ON');    
            sound.bgm.mute(false);
        }
    })

    elements.menu.nav.on('change', function() {
        loadEvent(this.value, true);
    })

    elements.menu.help.on('click', function() {
        showHelp();
    })

    $('button').on('click', function() { sound.click.play(); });
}

var initGuiPostData = function() {
    Object.keys(events).forEach(function(eventId) {
        if (events[eventId].checkpoint) {
            elements.menu.nav.append($('<option>', { value: eventId, text: events[eventId].checkpoint}));    
        }
    });
}

// Shell
var shell_addQuery = function(e, query) {
    var elems = {};
    elems.pretext = $('<span>', { text: query.pretext });
    elems.input = $('<input>', { class: 'shell-line-input' });

    var closeInput = function() {
        elems.pretext.remove();
        elems.input.remove();
        shell_addText(e, query.pretext + elems.input.val());
    }
    elems.input.keypress(function (e) { if (e.which == 13) {
        if (query.callback) {
            query.callback(this.value, closeInput);
        } else {
            alert(this.value);
        }
    }});

    e.append(elems.pretext)
    e.append(elems.input);
    elems.input.focus();
    elems.input.val(query.text);
}

var shell_addText = function(e, text) {
    var elem_text = text ? $('<span/>', { class: 'shell-line', text: text }) : $('<br>');
    e.append(elem_text);
}

// Qualm
var genQualmId = function() {
    return Math.random().toString(36).slice(2);    
}

var initQualm = function(moduleName, qualmId) {
    $.get(URL_QUALM_INIT, { module: moduleName, id: qualmId });    
}
var sendQuery = function(query, callback, qualmId, delay) {
    console.log('send query:', query);
    setTimeout(function() {
        $.get(URL_QUALM_QUERY, { q: query, id: qualmId }, function(data) {
            console.log('got response:', data);
            callback(data);
        });
    }, delay);
}
var closeQualm = function(query, qualmId) {
    $.get(URL_QUALM_CLOSE, { id: qualmId });    
}

init();
