ig.module('load-from-pause')
    .requires(
        'game.feature.gui.screen.pause-screen',
        'game.feature.menu.gui.save.save-list'
    )
    .defines(() => {
        sc.PauseScreenGui.inject({
            loadGameButton: null,
            
            init(...args) {
                this.parent(...args);
                
                this.loadGameButton = new sc.ButtonGui(ig.lang.get('sc.gui.title-screen.load'),
                    sc.BUTTON_DEFAULT_WIDTH);
                this.loadGameButton.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_BOTTOM);
                this.loadGameButton.onButtonPress = function() {
                    sc.menu.loadMode = true;
                    sc.menu.setDirectMode(true, sc.MENU_SUBMENU.SAVE);
                    sc.model.enterMenu(true)
                }.bind(this);
                
                this.addChildGui(this.loadGameButton);
            },
            
            updateButtons(...args) {
                this.parent(...args);
                
                this.removeChildGui(this.loadGameButton);
                
                var c = sc.arena.runtime;
                if (sc.arena.active && c && c.roundStarted && !c.roundFinished && !c.roundEndPre && sc.model.currentState != sc.GAME_MODEL_STATE.CUTSCENE) {
                    // "Save Game" doesn't show up in arena, so "Load Game" shouldn't either
                } else {
                    this.addChildGui(this.loadGameButton);
                    
                    // "Load Game" goes between "Save Game" and "Return to Title"
                    // we need to reposition and reassign focus indices...
                    this.buttonGroup.clear();
                    
                    this.buttonGroup.addFocusGui(this.resumeButton, 0, 0, true);
                    this.buttonGroup.addFocusGui(this.optionsButton, 0, 1);
                    this.buttonGroup.addFocusGui(this.loadGameButton, 0, 2);
                    this.buttonGroup.addFocusGui(this.saveGameButton, 0, 3);
                    
                    this.toTitleButton.setPos(3, 3);
                    c = this.toTitleButton.hook.size.y;
                    
                    if (sc.model.currentState == sc.GAME_MODEL_STATE.CUTSCENE && !sc.model.skipBlock) {
                        this.buttonGroup.addFocusGui(this.skipButton, 0, 4);
                        this.buttonGroup.addFocusGui(this.toTitleButton, 0, 5);
                        this.skipButton.setPos(3, 3 + c + 4);
                        this.saveGameButton.setPos(3, c * 2 + 11);
                        this.loadGameButton.setPos(3, c * 3 + 15);
                        this.optionsButton.setPos(3, c * 4 + 19);
                        this.resumeButton.setPos(3, c * 5 + 23)
                    } else if (sc.model.cancelButtonText) {
                        this.buttonGroup.addFocusGui(this.cancelButton, 0, 4);
                        this.buttonGroup.addFocusGui(this.toTitleButton, 0, 5);
                        this.cancelButton.setPos(3, 3 + c + 4);
                        this.saveGameButton.setPos(3, c * 2 + 11);
                        this.loadGameButton.setPos(3, c * 3 + 15);
                        this.optionsButton.setPos(3, c * 4 + 19);
                        this.resumeButton.setPos(3, c * 5 + 23)
                    } else {
                        this.buttonGroup.addFocusGui(this.toTitleButton, 0, 4);
                        this.saveGameButton.setPos(3, 3 + c + 4);
                        this.loadGameButton.setPos(3, c * 2 + 11);
                        this.optionsButton.setPos(3, c * 3 + 15);
                        this.resumeButton.setPos(3, c * 4 + 19)
                    }
                    
                    if (window.IG_GAME_DEBUG) {
                        c = ig.lang.get('sc.gui.title-screen.load');
                        sc.model.isSaveAllowed() || (c = '\\c[4]' + c);
                        this.loadGameButton.setText(c);
                        this.loadGameButton.setWidth(sc.BUTTON_DEFAULT_WIDTH)
                    } else this.loadGameButton.setActive(sc.model.isSaveAllowed())
                }
            }
        });
        
        sc.SaveList.inject({
            onSlotLoadPressed(...args) {
                this.parent(...args);
                
                // forcibly unpause the game so that we don't get stuck in a black screen
                // after loading a save file from the pause menu
                sc.model.enterRunning()
            }
        });
    });
