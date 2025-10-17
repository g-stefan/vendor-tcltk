// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022-2025 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("vendor");

Project.vendor = Project.name + "-" + Project.version;

Shell.mkdirRecursivelyIfNotExists("archive");

// Self
if (Shell.fileExists("archive/" + Project.vendor + ".7z")) {
	if (Shell.getFileSize("archive/" + Project.vendor + ".7z") > 16) {
		return;
	};
	Shell.removeFile("archive/" + Project.vendor + ".7z");
};

var vendorSourceGit = "https://github.com/g-stefan";
if (Shell.hasEnv("VENDOR_SOURCE_GIT")) {
	vendorSourceGit = Shell.getenv("VENDOR_SOURCE_GIT");
};

var vendorSourceAuth = "";
if (Shell.hasEnv("VENDOR_SOURCE_AUTH")) {
	vendorSourceAuth = Shell.getenv("VENDOR_SOURCE_AUTH");
};

exitIf(Shell.system("curl --insecure --location " + vendorSourceGit + "/vendor-" + Project.name + "/releases/download/v" + Project.version + "/" + Project.vendor + ".7z "+vendorSourceAuth+" --output archive/" + Project.vendor + ".7z"));
if (Shell.getFileSize("archive/" + Project.vendor + ".7z") > 32768) {
	return;
};
Shell.removeFile("archive/" + Project.vendor + ".7z");

// Source
runInPath("archive", function() {
	webLink = "http://prdownloads.sourceforge.net/tcl/tcl902-src.zip";
	if (!Shell.fileExists(Project.vendor + ".zip")) {
		exitIf(Shell.system("curl --insecure --location " + webLink + " --output " + Project.vendor + "-tcl.zip"));
	};

	webLink = "http://prdownloads.sourceforge.net/tcl/tk902-src.zip";
	if (!Shell.fileExists(Project.vendor + ".zip")) {
		exitIf(Shell.system("curl --insecure --location " + webLink + " --output " + Project.vendor + "-tk.zip"));
	};

	exitIf(Shell.system("7z x " + Project.vendor + "-tcl.zip -aoa -o."));
	exitIf(Shell.system("7z x " + Project.vendor + "-tk.zip -aoa -o."));

	Shell.mkdirRecursivelyIfNotExists(Project.vendor);

	Shell.rename("tcl9.0.2",Project.vendor+"/tcl");
	Shell.rename("tk9.0.2",Project.vendor+"/tk");

	Shell.removeFile(Project.vendor + "-tcl.zip");
	Shell.removeFile(Project.vendor + "-tk.zip");
	Shell.removeFile(Project.vendor + ".7z");
	exitIf(Shell.system("7z a -mx9 -mmt4 -r- -sse -w. -y -t7z " + Project.vendor + ".7z " + Project.vendor));
	Shell.removeDirRecursively(Project.vendor);
});
