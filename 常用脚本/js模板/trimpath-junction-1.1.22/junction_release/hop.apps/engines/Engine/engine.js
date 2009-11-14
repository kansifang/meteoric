function getChildElement(name) {
    if ('apps' == name)
        return new EngineApps();
    return this.get(name);
}
