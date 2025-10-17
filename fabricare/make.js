// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022-2025 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("vendor");

messageAction("make");

if (Shell.fileExists("temp/build.done.flag")) {
	return;
};

if (!Shell.directoryExists("source")) {
	exitIf(Shell.system("7z x -aoa archive/" + Project.vendor + ".7z"));
	Shell.rename(Project.vendor, "source");
};

Shell.mkdirRecursivelyIfNotExists("output");
Shell.mkdirRecursivelyIfNotExists("output/bin");
Shell.mkdirRecursivelyIfNotExists("output/include");
Shell.mkdirRecursivelyIfNotExists("output/lib");
Shell.mkdirRecursivelyIfNotExists("temp");

// TCL

Shell.copyFile("fabricare/source/tcl.buildall.vc.bat","source/tcl/win/buildall.vc.bat");

runInPath("source/tcl/win", function() {
	Shell.system("cmd.exe /C \"call buildall.vc.bat\"");
});

Shell.copyFilesToDirectory("source/tcl/win/Release_AMD64_VC1944/*.dll","output/bin");
Shell.copyFilesToDirectory("source/tcl/win/Release_AMD64_VC1944/*.exe","output/bin");
Shell.copyFilesToDirectory("source/tcl/win/Release_AMD64_VC1944/*.zip","output/bin");
Shell.copyFile("source/tcl/win/Release_AMD64_VC1944/tclsh90.exe", "output/bin/tclsh.exe");

Shell.copyFilesToDirectory("source/tcl/generic/*.h","output/include/tcl");
Shell.copyFilesToDirectory("source/tcl/win/*.h","output/include/tcl");

Shell.copyFilesToDirectory("source/tcl/win/Release_AMD64_VC1944/*.lib","output/lib");

// TK

Shell.copyFile("fabricare/source/tk.buildall.vc.bat","source/tk/win/buildall.vc.bat");
Shell.copyFile("fabricare/source/tk.makefile.vc","source/tk/win/makefile.vc");
runInPath("source/tk/win", function() {
	Shell.setenv("TCLDIR", "../../tcl");
	Shell.system("cmd.exe /C \"call buildall.vc.bat\"");
});

Shell.copyFilesToDirectory("source/tk/win/Release_AMD64_VC1944/*.dll","output/bin");
Shell.copyFilesToDirectory("source/tk/win/Release_AMD64_VC1944/*.exe","output/bin");
Shell.copyFilesToDirectory("source/tk/win/Release_AMD64_VC1944/*.zip","output/bin");
Shell.copyFile("source/tk/win/Release_AMD64_VC1944/wish90.exe", "output/bin/wish.exe");

Shell.copyFilesToDirectory("source/tk/generic/*.h","output/include/tk");
Shell.copyFilesToDirectory("source/tk/generic/ttk/*.h","output/include/tk/ttk");
Shell.copyFilesToDirectory("source/tk/win/*.h","output/include/tk");

Shell.copyFilesToDirectory("source/tk/win/Release_AMD64_VC1944/*.lib","output/lib");

Shell.filePutContents("temp/build.done.flag", "done");
