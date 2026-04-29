!macro customInstall
  DetailPrint "Register erodus URI Handler"
  DeleteRegKey HKCR "erodus"
  WriteRegStr HKCR "erodus" "" "URL:erodus"
  WriteRegStr HKCR "erodus" "URL Protocol" ""
  WriteRegStr HKCR "erodus\DefaultIcon" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  WriteRegStr HKCR "erodus\shell" "" ""
  WriteRegStr HKCR "erodus\shell\Open" "" ""
  WriteRegStr HKCR "erodus\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend

!macro customUnInstall
  DetailPrint "Unregister erodus URI Handler"
  DeleteRegKey HKCR "erodus"
  MessageBox MB_OK "erodus has been uninstalled."
!macroend

