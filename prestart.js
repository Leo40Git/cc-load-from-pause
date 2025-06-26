nax.ccuilib.pauseScreen.addButton({
    text: '',
    onPress() {
        sc.menu.loadMode = true;
        sc.menu.setDirectMode(true, sc.MENU_SUBMENU.SAVE);
        sc.model.enterMenu(true)
    },
    onShow(button) {
        button.setText(ig.lang.get('sc.gui.title-screen.load'), true)
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
