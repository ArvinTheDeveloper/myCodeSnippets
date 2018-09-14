#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

#c::
clipboard =
Send ^c
Clipwait
winTxt := Clipboard
return

#v::
SendRaw, %winTxt%
sleep 100 
return

^<::
clipboard =
SendInput ^c
Clipwait
string := Clipboard
length := StrLen(string) - 2
string := SubStr(string,2, length)
SendRaw, %string%
return