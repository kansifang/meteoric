function getChildElement(name) {
    var spaceKey = parseInt(name);
    if (spaceKey && !isNaN(spaceKey) && 
        spaceKey > 0)
        return new Engine();
    return this.get(name);
}
