//=============================================================================
// BurmesePatch.js
//=============================================================================

/*:
 * @plugindesc Burmese text patch.
 * @author Edward HHA Law
 *
 * @help This plugin does not provide plugin commands.
 */

(function() {


    Window_Base.prototype.processCharacter = function(textState) {
        switch (textState.text[textState.index]) {
        case '\n':
            this.processNewLine(textState);
            break;
        case '\f':
            this.processNewPage(textState);
            break;
        case '\x1b':
            this.processEscapeCharacter(this.obtainEscapeCode(textState), textState);
            break;
        default:
            if (textState.text[textState.index] >= 'က' 
            && textState.text[textState.index] <= '႟')
                this.processBurmeseCharacter(textState);
            else
                this.processNormalCharacter(textState);
            break;
        }
    };

    const specialChars = ['ဢ','ဣ','ဤ','ဥ','ဦ','ဧ','ဩ','ဪ', 'ဿ', '၌','၍','၎','၏', '၊', '။']
    const contChars = ['ေ', '္']

    Window_Base.prototype.processBurmeseCharacter = function(textState) {
        // while not end of string AND next character starts
        var s = textState.index;
        
        while (textState.index < textState.text.length
            && textState.text[textState.index] >= 'က' 
            && textState.text[textState.index] <= '႟') {
            textState.index++;
            // if previous one is သဝေထိုး or ကင်းစီး don't break
            if ((textState.index >= textState.text.length)
            || (textState.text[textState.index] >= 'က' && textState.text[textState.index] <= 'အ'
                && !contChars.includes(textState.text[textState.index-1]))
            || (textState.text[textState.index] >= '၀' && textState.text[textState.index] <= '၉')
            || (specialChars.includes(textState.text[textState.index])))
                break;    
        }
        var e = textState.index;
        var c = textState.text.substring(s, e);
        var w = this.textWidth(c);
        
        this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
        textState.x += w;
    };

})();
