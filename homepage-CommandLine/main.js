/* Created by Brian Holle with the guidance of Ander Sevenrud's sample programs */
(function() {

  var $output;
  var _inited = false;
  var _locked = false;
  var _buffer = [];
  var _obuffer = [];
  var _ibuffer = [];
  var _cwd = "/";
  var _prompt = function() { return _cwd + " $ "; };
  var _history = [];
  var _hindex = -1;
  var _lhindex = -1;

  var _filetree = {
    'documents': {type: 'dir', 
        files: {
            'AboutMe': {type: 'file',
                mime: 'text/plain', 
                content: "\n    Look at that! You have found your way to my about me description. I guess for starters... My name is Brian Holle\nand simply put, I enjoy computers. I am a Senior at the University of Scranton and am majoring in Computer Information\nSystems.\n\n    I currently am employed at UPS as a Software Engineering Co-Op and spend most of my free time either at the office\nor working on side projects. Other hobbies of mine include snowboarding, various sports, netflix bindging, and of course, \ntinkering with new technology. Alright... Thats it for an introduction. Feel free to keep browsing my site to learn more\nabout my work experience, projects, activities, and a bundle of other things!\n\n    -Brian"
            },
            'Skills': {type: 'file',
                mime: 'text/plain', 
                content: "\n    Over the past few years I have worked on many projects that have covered a variety of topics. Because of this,\n I think that some of my soft skills are more impressive than my hard skills. My ability work through different environments\n and solve a variety of problems in different languages makes me very flexible and adaptive. I would say this is one of my\n strongest soft skills in relation to computer science. I also have a strong ability to look at a problem from several different\n angles and produce \" out of the box \" solutions. Lastly, I am great at working with teams. As some of my projects have shown, I\n have the ability to conform to a team that I am in and work with them in order to get the job done. \n\n    Some of my hard skills include my experience in a variety of languages including: Java, C, VB, SQL, and Python.\nI also am proficient/expecienced with Linux Scripting, Git, PEP8, PHP, HTML, CSS, and more."
            },
            'Favorite_Classes': {type: 'file', 
                mime: 'text/plain', content: "\n    Although some students like to list their relevant classes, I think it would be easier to list my favorite classes. Most CS/CIS\n students take similar classes as an undergrad, so listing all of these seems rather trivial. My favorite\n classes that were taken at The University Of Scranton include: \nMachine Organization and Assembly Language, \n File Processing, \n Operating Systems, \n Database Systems.\n\n    It was through these classes that I truly learned what it meant to code and how I needed to think in order to do it\n successfully. I learned the power of writing thuroughly commented and as one professor put it: \"Beautiful Code.\" I learned \nhow to look at a problem, disolve it into managable parts, attack one problem at a time, and lastly, put all of\n the pieces together to create a final product, a completed puzzle."
            },
            'Relevant_Experience': {type: 'file',
                mime: 'text/plain',
                content: "\nUnited Parcel Service - Scranton P.A. - Paramus N.J.\nSoftware Engineer Co-Op\n\n    Converted a legacy application used for all accounts receivable related tasks from VB6 into Java\n    Updated Excel macros to increase processing times by 75%\n    Developed a report exporter for the companies AR system that was implemented company-wide\n\nUniversity of Scranton - Scranton P.A.\nTechnical Consultant\n\n    Assisted students with technical support within the library\n    Collaborated with professors to maximize the effectiveness of technology in the classroom\n    Helped find solutions to everyday problems through the use of new technology\n\nThe Seeing Eye - Morristown N.J.\nTechnical Intern\n\n    Piloted help desk model that was later implemented over the entire company’s network\n    Troubleshot technical issues that arose in the work environment\n    Inventoried all computer equipment"
            },
            'Projects': {type: 'dir', 
                files: {
                    'DesktopNoteSaver': {type: 'file',
                        mime: 'text/plain', 
                        content: "\n    This was  a program written mostly in Python. The program is binded to a hotkey and can be\ncalled whenever needed. Pressing of the hotkey will open a text document with all text that is\ncurrently on your desktop image. You can then edit that text, and save it. Upon saving the\nnotepad document, your desktop background image will be updated with the latest text.\n\n    This is very helpful in the case of taking quick notes that you will use later. This program\ncreates a way to do so without the need of a program running 24/7 (example: windows “sticky notes”\nprogram)."
                    },
                    'TwitterArchiver': {type: 'file',
                        mime: 'text/plain',
                        content:"\n    This was a Python script that I wrote to archive tweets posted by specifix users.\nThere is not much more to be said here. The idea of this program was to potentially save large amounts of\ndata to later be evaluated. This project was the start of my research into Big Data."
                    },
                    'Charity-League': {type: 'file',
                        mime: 'text/plain',
                        content: "\n   This was a responsive web app that I designed at the 2016 UPS hackathon. The team and I\nstayed up all night to develop this application within 28 hours. To create it, we used meteor and meteor kitchen.\nThese technologies made use of mongoDB to manage our database requiring information. We created a web app that at first prompts the user with 3 forms of\nverification. Charity, Company, and Employee. The charity login lets you register a charity and post events that your \ncharity is hosting. These events are able to be toggled on and displayed to the companies. Companies can then see these events and\nchoose which ones to make available to their employees. One the company toggles an event\non, the employees can now see events. They can gain points by doing different event related \nactivities. We also launched a mobile android app to display this information in a mobile app design for those\nusers that did not like viewing it within a browser. We placed second place in the Hackathon."
                    },
                    'ClientServerGame': {type: 'file',
                        mime: 'text/plain',
                        content: "\n    This project was a Client/Server game with multi-threading, mutex protection, user\nauthentication, account creation, ranked scoreboard, random matchmaking, invitation\nmatchmaking, ranked and unranked games (games that counted towards high scores). The\nproject was soon to also include a chat feature to allow users to communicate, however,\nmy focus eventually shifted."
                    }
                }
            }
        }
    },
    'AUTHORS': {type: 'file',
        mime: 'text/plain',
        content: "Created by Brian Holle <MrBrianHolle@gmail.com>"},
    'README' : {type: 'file', 
        mime: 'text/plain', 
        content: 'Most of the relevant information pertaining to me are stored within the \"documents\" folder.'
    },
  };

  var _commands = {

    sound: function(volume, duration, freq) {
      if ( !window.webkitAudioContext ) {
        return ['Your browser does not support his feature :('];
      }

      volume = ((volume || '').replace(/[^0-9]/g, '') << 0) || 100;
      duration = ((duration || '').replace(/[^0-9]/g, '') << 0) || 1;
      freq = ((freq || '').replace(/[^0-9]/g, '') << 0) || 1000;

      var context = new webkitAudioContext();
      var osc = context.createOscillator();
      var vol = context.createGainNode();

      vol.gain.value = volume/100;
      osc.frequency.value = freq;
      osc.connect(vol);
      vol.connect(context.destination);
      osc.start(context.currentTime);

      setTimeout(function() {
        osc.stop();
        osc = null;
        context = null;
        vol = null;
      }, duration*1000);

      return ([
        'Volume:    ' + volume,
        'Duration:  ' + duration,
        'Frequenzy: ' + freq
      ]).join("\n");
    },

    ls: function(dir) {
      dir = parsepath((dir || _cwd));

      var out = [];
      var iter = getiter(dir);

      var p;
      var tree = (iter && iter.type == 'dir') ? iter.files : _filetree;
      var count = 0;
      var total = 0;

      for ( var i in tree ) {
        if ( tree.hasOwnProperty(i) ) {
          p = tree[i];
          if ( p.type == 'dir' ) {
            out.push(format('{0} {1} {2}', padRight('<'+i+'>', 20), padRight(p.type, 20), '0'));
          } else {
            out.push(format('{0} {1} {2}', padRight(i, 20), padRight(p.mime, 20), p.content.length));
            total += p.content.length;
          }
          count++;
        }
      }

      out.push(format("\n{0} file(s) in total, {1} byte(s)", count, total));

      return out.join("\n");
    },

    cd: function(dir) {
      if ( !dir ) {
        return (["You need to supply argument: dir"]).join("\n");
      }

      var dirname = parsepath(dir);
      var iter = getiter(dirname);
      if ( dirname == '/' || (iter && iter.type == 'dir')) {
        _cwd = dirname;
        return (['Entered: ' + dirname]).join("\n");
      }

      return (["Path not found: " + dirname]).join("\n");
    },

    cat: function(file) {
      if ( !file ) {
        return (["You need to supply argument: filename"]).join("\n");
      }

      var filename = parsepath(file);
      var iter = getiter(filename);
      if ( !iter ) {
        return (["File not found: " + filename]).join("\n");
      }

      return iter.content;
    },

    cwd: function() {
      return (['Current directory: ' + _cwd]).join("\n");
    },

    clear: function() {
      return false;
    },

    contact: function(key) {
      key = key || '';
      var out = [];

      switch ( key.toLowerCase() ) {
        case 'email' :
          window.open('mailto:mrbrianholle@gmail.com');
          break;
        case 'linkedin' :
          window.open('http://www.linkedin.com/in/mrbrianholle');
          break;
        default :
          if ( key.length ) {
            out = ['Invalid key: ' + key];
          } else {
            out = [
              "Contact information:\n",
              'Name:      Brian Holle',
              'Email:     mrbrianholle@gmail.com',
              'LinkedIn:  http://www.linkedin.com/in/mrbrianholle',
            ];
          }
          break;
      }

      return out.join("\n");
    },

    help: function() {
      var out = [
        'help                                         This command',
        'contact                                      How to contact author',
        'contact <key>                                Open page (example: `email` or `google+`)',
        'clear                                        Clears the screen',
        'ls                                           List current (or given) directory contents',
        'cd <dir>                                     Enter directory',
        'cat <filename>                               Show file contents',
        'GoGraphical                                  Open Graphical Version of this page',
        ''
      ];

      return out.join("\n");
    },
    GoGraphical: function(){
      window.open('http://www.brianholle.com/homepage');
    }

  };

  /////////////////////////////////////////////////////////////////
  // UTILS
  /////////////////////////////////////////////////////////////////

  function setSelectionRange(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
      input.focus();
      input.setSelectionRange(selectionStart, selectionEnd);
    }
    else if (input.createTextRange) {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveEnd('character', selectionEnd);
      range.moveStart('character', selectionStart);
      range.select();
    }
  }

  function format(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    var sprintfRegex = /\{(\d+)\}/g;

    var sprintf = function (match, number) {
      return number in args ? args[number] : match;
    };

    return format.replace(sprintfRegex, sprintf);
  }


  function padRight(str, l, c) {
    return str+Array(l-str.length+1).join(c||" ")
  }

  function padCenter(str, width, padding) {
    var _repeat = function(s, num) {
      for( var i = 0, buf = ""; i < num; i++ ) buf += s;
      return buf;
    };

    padding = (padding || ' ').substr( 0, 1 );
    if ( str.length < width ) {
      var len     = width - str.length;
      var remain  = ( len % 2 == 0 ) ? "" : padding;
      var pads    = _repeat(padding, parseInt(len / 2));
      return pads + str + pads + remain;
    }

    return str;
  }

  function parsepath(p) {
    var dir = (p.match(/^\//) ? p : (_cwd  + '/' + p)).replace(/\/+/g, '/');
    return realpath(dir) || '/';
  }

  function getiter(path) {
    var parts = (path.replace(/^\//, '') || '/').split("/");
    var iter = null;

    var last = _filetree;
    while ( parts.length ) {
      var i = parts.shift();
      if ( !last[i] ) break;

      if ( !parts.length ) {
        iter = last[i];
      } else {
        last = last[i].type == 'dir' ? last[i].files : {};
      }
    }

    return iter;
  }

  function realpath(path) {
    var parts = path.split(/\//);
    var path = [];
    for ( var i in parts ) {
      if ( parts.hasOwnProperty(i) ) {
        if ( parts[i] == '.' ) {
          continue;
        }

        if ( parts[i] == '..' ) {
          if ( path.length ) {
            path.pop();
          }
        } else {
          path.push(parts[i]);
        }
      }
    }

    return path.join('/');
  }

  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    function( callback ){
      window.setTimeout(callback, 1000 / 60);
    };
  })();

  /////////////////////////////////////////////////////////////////
  // SHELL
  /////////////////////////////////////////////////////////////////

  (function animloop(){
    requestAnimFrame(animloop);

    if ( _obuffer.length ) {
      $output.value += _obuffer.shift();
      _locked = true;

      update();
    } else {
      if ( _ibuffer.length ) {
        $output.value += _ibuffer.shift();

        update();
      }

      _locked = false;
      _inited = true;
    }
  })();

  function print(input, lp) {
    update();
    _obuffer = _obuffer.concat(lp ? [input] : input.split(''));
  }

  function update() {
    $output.focus();
    var l = $output.value.length;
    setSelectionRange($output, l, l);
    $output.scrollTop = $output.scrollHeight;
  }

  function clear() {
    $output.value = '';
    _ibuffer = [];
    _obuffer = [];
    print("");
  }

  function command(cmd) {
    print("\n");
    if ( cmd.length ) {
      var a = cmd.split(' ');
      var c = a.shift();
      if ( c in _commands ) {
        var result = _commands[c].apply(_commands, a);
        if ( result === false ) {
          clear();
        } else {
          print(result || "\n", true);
        }
      } else {
        print("Unknown command: " + c);
      }

      _history.push(cmd);
    }
    print("\n\n" + _prompt());

    _hindex = -1;
  }

  function nextHistory() {
    if ( !_history.length ) return;

    var insert;
    if ( _hindex == -1 ) {
      _hindex  = _history.length - 1;
      _lhindex = -1;
      insert   = _history[_hindex];
    } else {
      if ( _hindex > 1 ) {
        _lhindex = _hindex;
        _hindex--;
        insert = _history[_hindex];
      }
    }

    if ( insert ) {
      if ( _lhindex != -1 ) {
        var txt = _history[_lhindex];
        $output.value = $output.value.substr(0, $output.value.length - txt.length);
        update();
      }
      _buffer = insert.split('');
      _ibuffer = insert.split('');
    }
  }

  window.onload = function() {
    $output = document.getElementById("output");
    $output.contentEditable = true;
    $output.spellcheck = false;
    $output.value = '';

    $output.onkeydown = function(ev) {
      var k = ev.which || ev.keyCode;
      var cancel = false;

      if ( !_inited ) {
        cancel = true;
      } else {
        if ( k == 9 ) {
          cancel = true;
        } else if ( k == 38 ) {
          nextHistory();
          cancel = true;
        } else if ( k == 40 ) {
          cancel = true;
        } else if ( k == 37 || k == 39 ) {
          cancel = true;
        }
      }

      if ( cancel ) {
        ev.preventDefault();
        ev.stopPropagation();
        return false;
      }

      if ( k == 8 ) {
        if ( _buffer.length ) {
          _buffer.pop();
        } else {
          ev.preventDefault();
          return false;
        }
      }

      return true;
    };

    $output.onkeypress = function(ev) {
      ev.preventDefault();
      if ( !_inited ) {
        return false;
      }

      var k = ev.which || ev.keyCode;
      if ( k == 13 ) {
        var cmd = _buffer.join('').replace(/\s+/, ' ');
        _buffer = [];
        command(cmd);
      } else {
        if ( !_locked ) {
          var kc = String.fromCharCode(k);
          _buffer.push(kc);
          _ibuffer.push(kc);
        }
      }

      return true;
    };

    $output.onfocus = function() {
      update();
    };

    $output.onblur = function() {
      update();
    };

    window.onfocus = function() {
      update();
    };

    print("Initializing Brian's Personal Shell v0.0.1 ....................................................\n");
    print("Loading initial ramDisk ...\n", true);
    print("Loading, please wait ...\n", true);
    print("[    2.194785] sd 0:0:0:0: [sda] Assuming Drive cashe: write through\n");
    print("[    2.194784] sd 0:0:0:0: [sda] Assuming Drive cashe: write through\n", true);
    print("[    2.194783] sd 0:0:0:0: [sda] Assuming Drive cashe: write through\n", true);
    print("INIT: version 2.88 booting\n", true);
    print("[info] Using makefile-style concurrent boot in runlevel S.\n", true);
    print("[ ok ] Starting the hot plug events dispatcher: udevd.\n", true);
    print("...] Synthesizing the initial hotplug events...[  2.700609] piix_smbus 0000:00:07.3: Host SMBus controller not enabled!\n", true);
    print("Shamelessly taking hollywood Boot from whoismrrobot.Thanks\n", true);
    print("INIT: version 2.88 booting\n", true);
    print("[info] Using makefile-style concurrent boot in runlevel S.\n", true);
    print("[ ok ] Starting the hot plug events dispatcher: udevd.\n", true);
    print("...] Synthesizing the initial hotplug events...[  2.700609] piix_smbus 0000:00:07.3: Host SMBus controller not enabled!\n", true);
    print("Shamelessly taking hollywood Boot from whoismrrobot.Thanks\n", true);
    print("[    2.194783] sd 0:0:0:0: [sda] Assuming Drive cashe: write through\n", true);
    print("INIT: version 2.88 booting\n", true);
    print("[info] Using makefile-style concurrent boot in runlevel S.\n", true);
    print("[ ok ] Starting the hot plug events dispatcher: udevd.\n", true);
    print("done.\n\n");
    setTimeout(function(){ clear(); 
        print("------------------------------------------------------------------------------------------------------------------\n", true);
        print("                  @@@  @@@  @@@  @@@@@@@@  @@@        @@@@@@@   @@@@@@   @@@@@@@@@@   @@@@@@@@                  \n", true);
        print("                  @@@  @@@  @@@  @@@@@@@@  @@@       @@@@@@@@  @@@@@@@@  @@@@@@@@@@@  @@@@@@@@                  \n", true);
        print("                  @@!  @@!  @@!  @@!       @@!       !@@       @@!  @@@  @@! @@! @@!  @@!                       \n", true);
        print("                  !@!  !@!  !@!  !@!       !@!       !@!       !@!  @!@  !@! !@! !@!  !@!                       \n", true);
        print("                  @!!  !!@  @!@  @!!!:!    @!!       !@!       @!@  !@!  @!! !!@ @!@  @!!!:!                    \n", true);
        print("                  !@!  !!!  !@!  !!!!!:    !!!       !!!       !@!  !!!  !@!   ! !@!  !!!!!:                    \n", true);
        print("                  !!:  !!:  !!:  !!:       !!:       :!!       !!:  !!!  !!:     !!:  !!:                       \n", true);
        print("                  :!:  :!:  :!:  :!:        :!:      :!:       :!:  !:!  :!:     :!:  :!:                       \n", true);
        print("                   :::: :: :::    :: ::::   :: ::::   ::: :::  ::::: ::  :::     ::    :: ::::                  \n", true);
        print("                    :: :  : :    : :: ::   : :: : :   :: :: :   : :  :    :      :    : :: ::                   \n", true);
        print("------------------------------------------------------------------------------------------------------------------", true);
        print("\n", true);

        print(padCenter("Thanks for stopping by! You can learn a little about me through some of the directories here.\n", 113), true);
        print(padCenter("If the command-line interface isn't for you, feel free to check out my graphical page\n", 90), true);
        print(padCenter("by clicking the button on the bottom right.\n", 100), true);

        print("\n", true);
        print("Type 'help' for a list of available commands.\n", true);
        print("\n\n" + _prompt());
    }, 3500);

  };

})();
