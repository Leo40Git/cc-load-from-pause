nax.ccuilib.pauseScreen.addButton({
    text: '',
    showCondition() {
        // replicate "Save Game" button conditions
        var c = sc.arena.runtime;
        return !(sc.arena.active && c && c.roundStarted && !c.roundFinished && !c.roundEndPre && sc.model.currentState != sc.GAME_MODEL_STATE.CUTSCENE)
    },
    enabledCondition() {
        // replicate "Save Game" button conditions
        return sc.model.isSaveAllowed()
    },
    onShow(button) {
        button.setText(ig.lang.get('sc.gui.title-screen.load'), true)
    },
    onPress() {
        sc.menu.loadMode = true;
        sc.menu.setDirectMode(true, sc.MENU_SUBMENU.SAVE);
        sc.model.enterMenu(true)
    }
})

sc.SaveList.inject({
    onSlotLoadPressed(...args) {
        this.parent(...args);
        
        // forcibly unpause the game so that we don't get stuck in a black screen
        // after loading a save file from the pause menu
        sc.model.enterRunning()
    }
});
