const fs = require("fs");
const path = require("path");

module.exports = (dir, ignore) => {
    const treeArr = [{
        name: path.basename(dir),
        str: path.basename(dir)
    }];
    
    const render = (name, isLast, deep) => {
        const line = deep.map(e => `${e ? '│' : ' '}  `).join('');
        const text = `${line}${isLast ? '└─' : '├─'} ${name}`;
        return {
            name: name,
            str: text
        }; 
    }

    const tree = (target, deep = []) => {
        const child = fs.readdirSync(target).filter(e => !e.startsWith('.'));
        const direct = [];
        const file = [];
        child.forEach((e) => {
            const dir = path.join(target, e);
            const stat = fs.statSync(dir);
            const flag = ignore.every((reg) => {
                return !dir.includes(reg);
            })
            if(flag){
                if(stat.isFile()){ 
                    file.push(e);
                }else{
                    direct.push(e);
                }
            }
            
        })
        direct.forEach((e, i) => {
            const dir = path.join(target, e);
            const isLast = (i === direct.length -1) && (file.length === 0);
            treeArr.push(render(e, isLast, deep));
            tree(dir, [...deep, !isLast]);
        })
        file.forEach((e, i) => {
            const isLast = i === file.length -1;
            treeArr.push(render(e, isLast, deep));
        })
    }
    
    tree(dir);
    return treeArr;
}