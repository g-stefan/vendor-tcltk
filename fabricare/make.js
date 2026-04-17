// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022-2026 Grigore Stefan <g_stefan@yahoo.com>
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

if (Fabricare.isDynamic()) {
	Shell.copyFile("fabricare/source/tcl.buildall.vc.bat","source/tcl/win/buildall.vc.bat");
};

if (Fabricare.isStatic()) {
	Shell.copyFile("fabricare/source/tcl.static.h","source/tcl/generic/tcl.h");
	Shell.copyFile("fabricare/source/tcl.buildall.vc.static.bat","source/tcl/win/buildall.vc.bat");
};

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

if (Fabricare.isDynamic()) {
	Shell.copyFile("fabricare/source/tk.buildall.vc.bat","source/tk/win/buildall.vc.bat");
};
if (Fabricare.isStatic()) {
	Shell.copyFile("source/tcl/win/Release_AMD64_VC1944/libtcl9.0.2.zip","source/tk/tcl/win/Release_AMD64_VC1944/libtcl9.0.2.zip");
	Shell.copyFile("fabricare/source/tk.buildall.vc.static.bat","source/tk/win/buildall.vc.bat");
};

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
Shell.copyFilesToDirectory("source/tk/xlib/X11/*.*","output/include/tk/X11");

Shell.copyFilesToDirectory("source/tk/win/Release_AMD64_VC1944/*.lib","output/lib");

if (Fabricare.isStatic()) {
	Shell.rename("output/lib/tcl9dde14sx.lib","output/lib/tcl9dde14.lib");
	Shell.rename("output/lib/tcl9registry13sx.lib","output/lib/tcl9registry13.lib");
	Shell.rename("output/lib/tcl9tk90sx.lib","output/lib/tcl9tk90.lib");
	Shell.rename("output/lib/tcl90sx.lib","output/lib/tcl90.lib");
	Shell.rename("output/lib/tclsh90sx.lib","output/lib/tclsh90.lib");
	Shell.rename("output/lib/wish90sx.lib","output/lib/wish90.lib");

	Shell.rename("output/bin/tclsh90sx.exe","output/bin/tclsh90.exe");
	Shell.rename("output/bin/wish90sx.exe","output/bin/wish90.exe");
	Shell.remove("output/bin/tclsh90sx-raw.exe");
	Shell.remove("output/bin/libtommath.dll");
	Shell.remove("output/bin/zlib1.dll");
};

Shell.filePutContents("temp/build.done.flag", "done");

