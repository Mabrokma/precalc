<?xml version='1.0'?> <!-- As XML file -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

<!-- This XSL file is a thin layer on MathBook XML.
     Create a file called precalc-paths.xsl (in this directory)
     that looks like the following, adapting it to your directory structure
        <?xml version='1.0'?> 
        <xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
        <xsl:import href="/home/cmhughes/Documents/projects/openmathdocs/mathbook/xsl/mathbook-latex.xsl" />
        <xsl:param name="latex.style.extra" select="'/home/cmhughes/Documents/projects/openmathdocs/precalc/style/latex/precalc-style.tex'" />
        </xsl:stylesheet>
-->
<xsl:import href="precalc-paths.xsl" />

<!-- Common thin layer                                                      -->
<xsl:import href="precalc-common.xsl" />

<!-- LaTeX-specific parameters                                              -->
<xsl:param name="latex.geometry" select="'letterpaper,total={6.25in,9.0in}'" />
<xsl:param name="latex.font.size" select="'10pt'" /> 
<xsl:param name="latex.preamble.early" select="document('latex.preamble.xml')//latex-preamble-early" />
<xsl:param name="latex.preamble.late" select="document('latex.preamble.xml')//latex-preamble-late" />



<xsl:template match="try-it-yourself">
    <xsl:text>\begin{tryityourself}&#xa;</xsl:text>
    <xsl:apply-templates select="exercise"/>
    <xsl:text>\end{tryityourself}&#xa;</xsl:text>
</xsl:template>

<xsl:template match="outcomes">
    <xsl:text>\begin{outcomes}&#xa;</xsl:text>
    <xsl:text>\begin{outcomelist}&#xa;</xsl:text>
    <xsl:apply-templates select="outcome"/>
    <xsl:text>\end{outcomelist}&#xa;</xsl:text>
    <xsl:text>\end{outcomes}&#xa;</xsl:text>
</xsl:template>

<xsl:template match="outcomes//outcome">
    <xsl:text>\item{}</xsl:text>
    <xsl:apply-templates />
    <xsl:text>&#xa;</xsl:text>
</xsl:template>

<xsl:template match="standout">
    <xsl:text>\begin{standout}[</xsl:text>
    <xsl:apply-templates select="title"/>
    <xsl:text>]&#xa;</xsl:text>
    <xsl:apply-templates select="*[not(self::title)]"/>
    <xsl:text>\end{standout}&#xa;</xsl:text>
</xsl:template>


<!-- Overwrite table parts to use booktabs.              -->
<xsl:template match="tabular/thead">
    <xsl:text>\toprule{}&#xa;</xsl:text>
    <xsl:apply-templates />
    <xsl:if test="*">
        <xsl:text>\\\midrule{}&#xa;</xsl:text>
    </xsl:if>
</xsl:template>
<xsl:template match="tabular/tfoot">
    <xsl:apply-templates />
    <xsl:text>\\\bottomrule{}&#xa;</xsl:text>    
</xsl:template>

<!-- Copy of Rob's tabular element from 3/19/15, but modified to apply -->
<!-- thead and tfoot elements (his just does rows)                     -->
<!-- A tabular layout -->
<xsl:template match="tabular">
    <!-- Determine global, table-wide properties -->
    <!-- set defaults here if values not given   -->
    <xsl:variable name="table-top">
        <xsl:choose>
            <xsl:when test="@top">
                <xsl:value-of select="@top" />
            </xsl:when>
            <xsl:otherwise>
                <xsl:text>none</xsl:text>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:variable>
    <xsl:variable name="table-left">
        <xsl:choose>
            <xsl:when test="@left">
                <xsl:value-of select="@left" />
            </xsl:when>
            <xsl:otherwise>
                <xsl:text>none</xsl:text>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:variable>
    <xsl:variable name="table-bottom">
        <xsl:choose>
            <xsl:when test="@bottom">
                <xsl:value-of select="@bottom" />
            </xsl:when>
            <xsl:otherwise>
                <xsl:text>none</xsl:text>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:variable>
    <xsl:variable name="table-right">
        <xsl:choose>
            <xsl:when test="@right">
                <xsl:value-of select="@right" />
            </xsl:when>
            <xsl:otherwise>
                <xsl:text>none</xsl:text>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:variable>
    <xsl:variable name="table-halign">
        <xsl:choose>
            <xsl:when test="@halign">
                <xsl:value-of select="@halign" />
            </xsl:when>
            <xsl:otherwise>
                <xsl:text>left</xsl:text>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:variable>
    <xsl:variable name="table-valign">
        <xsl:choose>
            <xsl:when test="@valign">
                <xsl:value-of select="@valign" />
            </xsl:when>
            <xsl:otherwise>
                <xsl:text>middle</xsl:text>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:variable>
    <!-- Build latex column specification                         -->
    <!--   vertical borders (left side, right side, three widths) -->
    <!--   horizontal alignment (left, center, right)             -->
    <xsl:text>\begin{tabular}{</xsl:text>
    <!-- start with left vertical border -->
    <xsl:call-template name="vrule-specification">
        <xsl:with-param name="width" select="$table-left" />
    </xsl:call-template>
    <xsl:choose>
        <!-- Potential for individual column overrides    -->
        <!--   Deduce number of columns from col elements -->
        <!--   Employ individual column overrides,        -->
        <!--   or use global table-wide values            -->
        <!--   write alignment (mandatory)                -->
        <!--   follow with right border (optional)        -->
        <xsl:when test="col">
            <xsl:for-each select="col">
                <xsl:call-template name="halign-specification">
                    <xsl:with-param name="align">
                        <xsl:choose>
                            <xsl:when test="@halign">
                                <xsl:value-of select="@halign" />
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:value-of select="$table-halign" />
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:with-param>
                </xsl:call-template>
                <xsl:call-template name="vrule-specification">
                    <xsl:with-param name="width">
                        <xsl:choose>
                            <xsl:when test="@right">
                                <xsl:value-of select="@right" />
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:value-of select="$table-right" />
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:with-param>
                </xsl:call-template>
            </xsl:for-each>
        </xsl:when>
        <!-- All columns specified identically so far   -->
        <!--   so can repeat global, table-wide values  -->
        <!--   use first row to determine number        -->
        <!--   write alignment (mandatory)              -->
        <!--   follow with right border (optional)      -->
        <xsl:otherwise>
            <xsl:for-each select="row[1]/cell">
                <xsl:call-template name="halign-specification">
                    <xsl:with-param name="align" select="$table-halign" />
                </xsl:call-template>
                <xsl:call-template name="vrule-specification">
                    <xsl:with-param name="width" select="$table-right" />
                </xsl:call-template>
            </xsl:for-each>
        </xsl:otherwise>
    </xsl:choose>
    <xsl:text>}</xsl:text>
    <!-- column specification done -->
    <!-- top horizontal rule is specified after column specification -->
    <xsl:choose>
        <!-- A col element might indicate top border customizations   -->
        <!-- so we walk the cols to build a cline-style specification -->
        <xsl:when test="col/@top">
            <xsl:call-template name="column-cols">
                <xsl:with-param name="the-col" select="col[1]" />
                <xsl:with-param name="col-number" select="1" />
                <xsl:with-param name="clines" select="''" />
                <xsl:with-param name="table-top" select="$table-top"/>
                <xsl:with-param name="prior-top" select="'undefined'" />
                <xsl:with-param name="start-run" select="1" />
            </xsl:call-template>
        </xsl:when>
        <!-- with no customization, we have one continuous rule (if at all) -->
        <!-- use global, table-wide value of top specification              -->
        <xsl:otherwise>
            <xsl:call-template name="hrule-specification">
                <xsl:with-param name="width" select="$table-top" />
            </xsl:call-template>
        </xsl:otherwise>
    </xsl:choose>
    <!-- now ready to build rows -->
    <xsl:text>&#xa;</xsl:text>
    <!-- table-wide values are needed to reconstruct/determine overrides -->
    <xsl:apply-templates select="thead" />
    <xsl:apply-templates select="row">
        <xsl:with-param name="table-left" select="$table-left" />
        <xsl:with-param name="table-bottom" select="$table-bottom" />
        <xsl:with-param name="table-right" select="$table-right" />
        <xsl:with-param name="table-halign" select="$table-halign" />
    </xsl:apply-templates>
    <xsl:apply-templates select="tfoot" />
    <!-- mandatory finish, exclusive of any final row specifications -->
    <xsl:text>\end{tabular}&#xa;</xsl:text>
</xsl:template>





<!-- Intend output for rendering by pdflatex -->
<xsl:output method="text" />

</xsl:stylesheet>