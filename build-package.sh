cd /devcontainer/src/

git clean -fxd

export DEBFULLNAME="Ani Balasubramaniam"
export DEBEMAIL="ani@anionline.me"
export DEBFOLDER="/devcontainer/src"
export PACKAGE="devcontainer"
export PACKAGE_VERSION="0.1"
export DEB_PACKAGE_NAME="${PACKAGE}_${PACKAGE_VERSION}"

echo "Packaging ${DEB_PACKAGE_NAME}..."

# Call dh_make to generate debian/*
dh_make --packagename "${DEB_PACKAGE_NAME}" --copyright mit --indep --createorig --yes

# Remove make calls
grep -v makefile debian/rules > debian/rules.new 
mv debian/rules.new debian/rules

# Write install file
echo 'devcontainer usr/bin' > debian/install
echo 'templates etc/devcontainer' >> debian/install

# Write links file
echo 'etc/devcontainer/templates /usr/bin/templates' > debian/links

# Remove example files
rm debian/*.ex

# Update link
sed -i 's=<insert the upstream URL, if relevant>=https://github.com/aniongithub/devcontainer=' debian/control

# Update description in control
sed -i 's/<insert up to 60 chars description>/CLI tool to create and manage devcontainer configurations/' debian/control

# Strip last line of long description
sed -i '$d' debian/control
echo ' devcontainer is a CLI tool that creates & manages one or more' >> debian/control
echo ' Visual Studio Code devcontainer configurations. It comes with' >> debian/control
echo ' useful templates for local and remote development.' >> debian/control

# Call debuild to create our deb package
debuild